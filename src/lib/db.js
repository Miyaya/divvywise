import { neon } from '@neondatabase/serverless';
import { sql } from '@vercel/postgres';
import eurRates from '@/data/eur.json';

// 使用Neon的serverless驅動
export const neonClient = neon(process.env.DATABASE_URL);

// 使用Vercel Postgres
export const vercelPostgres = sql;

// 獲取所有參與者
export async function getParticipants() {
  try {
    const result = await vercelPostgres`
      SELECT u.uuid, u.name, u.username
      FROM "user" u
      JOIN participant p ON u.uuid = p.user_uuid
      WHERE p.trip_uuid = 'd26b7ce6-ee36-4a61-98bc-edebe1cdf1bc'
    `;
    return result.rows;
  } catch (error) {
    console.error('Error fetching participants:', error);
    return [];
  }
}

// 獲取所有購買記錄
export async function getPurchases() {
  try {
    const result = await vercelPostgres`
      SELECT 
        p.uuid,
        p.item_name as item,
        p.amount,
        p.currency,
        p.item_note as note,
        p.date as timestamp,
        u.name as payer,
        (
          SELECT array_agg(u2.name)
          FROM transaction t
          JOIN "user" u2 ON t.debtor = u2.uuid
          WHERE t.purchase_uuid = p.uuid
        ) as debtors
      FROM purchase p
      JOIN "user" u ON p.payer_uuid = u.uuid
      WHERE p.trip_uuid = 'd26b7ce6-ee36-4a61-98bc-edebe1cdf1bc'
      ORDER BY p.date DESC
    `;
    return result.rows;
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return [];
  }
}

// 獲取所有交易
export async function getTransactions() {
  try {
    const result = await vercelPostgres`
      SELECT 
        t.uuid,
        t.amount,
        t.currency,
        t.is_payoff,
        u1.name as creditor_name,
        u2.name as debtor_name,
        p.item_name,
        p.date
      FROM transaction t
      JOIN "user" u1 ON t.creditor = u1.uuid
      JOIN "user" u2 ON t.debtor = u2.uuid
      JOIN purchase p ON t.purchase_uuid = p.uuid
      WHERE p.trip_uuid = 'd26b7ce6-ee36-4a61-98bc-edebe1cdf1bc'
      ORDER BY p.date DESC
    `;
    return result.rows;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

// 獲取行程信息
export async function getTripInfo() {
  try {
    const result = await vercelPostgres`
      SELECT uuid, name, currencies, main_currency
      FROM trip
      WHERE uuid = 'd26b7ce6-ee36-4a61-98bc-edebe1cdf1bc'
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching trip info:', error);
    return null;
  }
}

// 獲取所有卡片
export async function getCards() {
  try {
    // 獲取行程信息，包括主要貨幣
    const tripInfo = await getTripInfo();
    if (!tripInfo) {
      throw new Error('Trip not found');
    }

    const mainCurrency = tripInfo.main_currency;

    // 使用 trip_debt_summary 視圖獲取債務摘要，並加入 user 表獲取用戶名字
    const result = await vercelPostgres`
      SELECT 
        t.creditor,
        t.debtor,
        t.total_debt as amount,
        t.currency,
        u1.name as creditor_name,
        u2.name as debtor_name
      FROM trip_debt_summary t
      JOIN "user" u1 ON t.creditor = u1.uuid
      JOIN "user" u2 ON t.debtor = u2.uuid
      WHERE t.trip_uuid = 'd26b7ce6-ee36-4a61-98bc-edebe1cdf1bc'
      ORDER BY t.total_debt DESC
    `;

    // 將所有債務轉換為主要貨幣（EUR）
    const debtsInMainCurrency = result.rows.map(row => {
      const originalAmount = parseFloat(row.amount);
      const originalCurrency = row.currency;

      // 如果原始貨幣已經是主要貨幣，則不需要轉換
      let amountInMainCurrency = originalAmount;

      // 如果原始貨幣不是主要貨幣，則使用匯率進行轉換
      if (originalCurrency !== mainCurrency) {
        // 從 eur.json 中獲取匯率
        const rate = eurRates.rates[originalCurrency];
        if (rate) {
          // 將金額轉換為 EUR（因為 eur.json 中的匯率是相對於 EUR 的）
          amountInMainCurrency = originalAmount / rate;
        } else {
          console.warn(`Exchange rate not found for ${originalCurrency}`);
        }
      }

      return {
        creditor: row.creditor_name,
        debtor: row.debtor_name,
        originalAmount,
        originalCurrency,
        amountInMainCurrency,
        mainCurrency
      };
    });

    // 按債權人和債務人分組，計算總債務
    const groupedDebts = {};

    debtsInMainCurrency.forEach(debt => {
      const key = `${debt.creditor}-${debt.debtor}`;
      if (!groupedDebts[key]) {
        groupedDebts[key] = {
          creditor: debt.creditor,
          debtor: debt.debtor,
          totalAmountInMainCurrency: 0,
          details: []
        };
      }

      groupedDebts[key].totalAmountInMainCurrency += debt.amountInMainCurrency;
      groupedDebts[key].details.push({
        originalAmount: debt.originalAmount,
        originalCurrency: debt.originalCurrency,
        amountInMainCurrency: debt.amountInMainCurrency
      });
    });

    // 計算淨債務（總結用戶之間的支付關係）
    const netDebts = {};

    // 遍歷所有債務關係
    Object.values(groupedDebts).forEach(debt => {
      const creditor = debt.creditor;
      const debtor = debt.debtor;
      const amount = debt.totalAmountInMainCurrency;

      // 檢查反向債務關係
      const reverseKey = `${debtor}-${creditor}`;
      const reverseDebt = groupedDebts[reverseKey];

      if (reverseDebt) {
        // 如果存在反向債務，計算淨債務
        const netAmount = amount - reverseDebt.totalAmountInMainCurrency;

        // 如果淨債務大於 0，則債務人需要支付債權人
        if (netAmount > 0) {
          const key = `${creditor}-${debtor}`;
          netDebts[key] = {
            creditor,
            debtor,
            netAmount,
            details: [
              {
                originalAmount: amount,
                originalCurrency: mainCurrency,
                amountInMainCurrency: amount
              },
              {
                originalAmount: -reverseDebt.totalAmountInMainCurrency,
                originalCurrency: mainCurrency,
                amountInMainCurrency: -reverseDebt.totalAmountInMainCurrency
              }
            ]
          };
        }
        // 如果淨債務小於 0，則債權人需要支付債務人
        else if (netAmount < 0) {
          const key = `${debtor}-${creditor}`;
          netDebts[key] = {
            creditor: debtor,
            debtor: creditor,
            netAmount: -netAmount,
            details: [
              {
                originalAmount: -amount,
                originalCurrency: mainCurrency,
                amountInMainCurrency: -amount
              },
              {
                originalAmount: reverseDebt.totalAmountInMainCurrency,
                originalCurrency: mainCurrency,
                amountInMainCurrency: reverseDebt.totalAmountInMainCurrency
              }
            ]
          };
        }
        // 如果淨債務等於 0，則不需要支付
      } else {
        // 如果不存在反向債務，則直接添加債務
        const key = `${creditor}-${debtor}`;
        netDebts[key] = {
          creditor,
          debtor,
          netAmount: amount,
          details: debt.details
        };
      }
    });

    // 轉換為數組並按淨債務金額排序
    const sortedNetDebts = Object.values(netDebts)
      .sort((a, b) => b.netAmount - a.netAmount);

    // 將結果轉換為前端需要的格式
    return sortedNetDebts.map(debt => ({
      payer: debt.creditor,
      debtor: debt.debtor,
      money: debt.details.map(detail => ({
        amount: detail.originalAmount,
        currency: detail.originalCurrency
      })),
      targetCurrency: mainCurrency,
      totalAmount: debt.netAmount.toFixed(2)
    }));
  } catch (error) {
    console.error('Error fetching cards:', error);
    return [];
  }
}

// 計算以主要貨幣（EUR）表示的債務關係
export async function calculateDebtsInMainCurrency() {
  try {
    // 獲取行程信息，包括主要貨幣
    const tripInfo = await getTripInfo();
    if (!tripInfo) {
      throw new Error('Trip not found');
    }

    const mainCurrency = tripInfo.main_currency;

    // 獲取所有債務摘要
    const result = await vercelPostgres`
      SELECT 
        t.creditor,
        t.debtor,
        t.total_debt as amount,
        t.currency,
        u1.name as creditor_name,
        u2.name as debtor_name
      FROM trip_debt_summary t
      JOIN "user" u1 ON t.creditor = u1.uuid
      JOIN "user" u2 ON t.debtor = u2.uuid
      WHERE t.trip_uuid = 'd26b7ce6-ee36-4a61-98bc-edebe1cdf1bc'
    `;

    // 將所有債務轉換為主要貨幣（EUR）
    const debtsInMainCurrency = result.rows.map(row => {
      const originalAmount = parseFloat(row.amount);
      const originalCurrency = row.currency;

      // 如果原始貨幣已經是主要貨幣，則不需要轉換
      let amountInMainCurrency = originalAmount;

      // 如果原始貨幣不是主要貨幣，則使用匯率進行轉換
      if (originalCurrency !== mainCurrency) {
        // 從 eur.json 中獲取匯率
        const rate = eurRates.rates[originalCurrency];
        if (rate) {
          // 將金額轉換為 EUR（因為 eur.json 中的匯率是相對於 EUR 的）
          amountInMainCurrency = originalAmount / rate;
        } else {
          console.warn(`Exchange rate not found for ${originalCurrency}`);
        }
      }

      return {
        creditor: row.creditor_name,
        debtor: row.debtor_name,
        originalAmount,
        originalCurrency,
        amountInMainCurrency,
        mainCurrency
      };
    });

    // 按債權人和債務人分組，計算總債務
    const groupedDebts = {};

    debtsInMainCurrency.forEach(debt => {
      const key = `${debt.creditor}-${debt.debtor}`;
      if (!groupedDebts[key]) {
        groupedDebts[key] = {
          creditor: debt.creditor,
          debtor: debt.debtor,
          totalAmountInMainCurrency: 0,
          details: []
        };
      }

      groupedDebts[key].totalAmountInMainCurrency += debt.amountInMainCurrency;
      groupedDebts[key].details.push({
        originalAmount: debt.originalAmount,
        originalCurrency: debt.originalCurrency,
        amountInMainCurrency: debt.amountInMainCurrency
      });
    });

    // 轉換為數組並按總金額排序
    return Object.values(groupedDebts)
      .sort((a, b) => b.totalAmountInMainCurrency - a.totalAmountInMainCurrency);

  } catch (error) {
    console.error('Error calculating debts in main currency:', error);
    return [];
  }
} 
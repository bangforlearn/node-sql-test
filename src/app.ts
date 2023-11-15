import { Pool } from 'pg';
import fetch from 'node-fetch';
import axios from 'axios';
import { log } from 'console';

// 數據庫配置 (請根據你的配置進行調整)
const pool = new Pool({
  user: 'bang',
  host: 'localhost',
  database: 'bang_db',
  password: 'abcd1234',
  port: 5432,
});

// 用於授權的令牌
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJiZDZkZWU0Ni1mY2FmLTQ1MzItYWJkZC02MWYwZmJiMGM4OGUiLCJpYXQiOjE3MDAwNzY4NDksImV4cCI6MTcwMTI4NjQ0OX0.E_FThKNzbzQ7ojdKxSxet56s3t4YQ_kNwAX3F7Wh0Vg';

const api_base_url =
  'https://sx03y6fhc9.execute-api.ap-northeast-1.amazonaws.com/dev/bcms/product/';

const patchRequest = async (product_uuid: string, filter_tag: string[]) => {
  try {
    // 你的 API 端點
    const url = `${api_base_url}${product_uuid}`;

    // 欲發送的 JSON 資料
    const data = {
      category_tags: filter_tag,
    };

    const response = await axios.patch(url, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    // 處理響應
    // console.log(response.data);
  } catch (error) {
    console.error('發送 PATCH 請求時出錯', error);
  }
};
const getEiDERProducts = async () => {
  try {
    // 開啟數據庫連接
    const client = await pool.connect();

    // SQL 查詢
    const query =
      "SELECT uuid,filter_tag FROM products WHERE brand_name = 'EiDER'";
    const result = await client.query(query);
    const length = result.rows.length;
    for (let index = 0; index < length; index++) {
      const element = result.rows[index] as {
        uuid: string;
        filter_tag?: string;
      };
      const data = {
        uuid: element.uuid,
        filter_tag: element.filter_tag
          ? (JSON.parse(element.filter_tag) as string[])
          : undefined,
      };
      if (data.filter_tag && data.filter_tag.length > 0) {
        //await patchRequest(data.uuid, data.filter_tag);
        console.log(
          `YES：https://admin-2bfhetuihq-de.a.run.app/products/edit/${data.uuid}`
        );
      } else {
        console.log(
          `NO：https://admin-2bfhetuihq-de.a.run.app/products/edit/${data.uuid}`
        );
      }
    }

    // 釋放連接
    client.release();
  } catch (error) {
    console.error('數據庫查詢錯誤', error);
  }
};

(async () => {
  await getEiDERProducts();

  // await patchRequest('068676a6-e33c-496d-9757-868a03e14e23', [
  //   '44c725b5-145c-43e4-a3ce-862d641e4bac',
  // ]);
})();

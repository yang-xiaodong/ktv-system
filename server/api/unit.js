const Router = require("koa-router");
const router = new Router();
const query = require("../database/init");
const checkRoot = require("./root");

router.post("/insertUnit", async ctx => {
  try {
    if (!checkRoot(ctx)) {
      return false;
    }

    const data = ctx.request.body.data;
    let result = [];
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i];
      const currentTime = new Date().getTime();
      const unit = await query(
        `SELECT * FROM unit WHERE name = ? AND off != 1`,
        [item.name]
      );
      if (unit.length !== 0) {
        result.push(item.name);
        continue;
      }
      await query(
        `INSERT INTO unit (name, sign, createTime) VALUES (?, ?, ?)`,
        [item.name, item.sign, currentTime]
      );
    }
    if (result.length === 0) {
      ctx.body = { code: 200, message: "新增成功" };
    } else {
      ctx.body = {
        code: 200,
        message: `单位 ${result.join(", ")} 已存在`,
        repeat: true
      };
    }
  } catch (err) {
    throw new Error(err);
  }
});

router.post("/getUnit", async ctx => {
  try {
    if (!checkRoot(ctx, true)) {
      return false;
    }

    const data = ctx.request.body.data;
    const pageNo = (data && data.pageNo) || 1;
    const pageSize = (data && data.pageSize) || 10;
    const count = await query(
      `SELECT COUNT(*) as count FROM unit WHERE off != 1`
    );
    const unitList = await query(
      `SELECT * FROM unit WHERE off != 1 ORDER BY createTime ASC`
    );
    ctx.body = { code: 200, message: unitList, count: count[0].count };
  } catch (err) {
    throw new Error(err);
  }
});

router.post("/deleteUnit", async ctx => {
  try {
    if (!checkRoot(ctx)) {
      return false;
    }

    const data = ctx.request.body.data;
    let ids = [];
    data.forEach(ele => {
      ids.push(ele.id);
    });
    await query(`UPDATE unit SET off = 1, updateTime = ? WHERE id IN ( ? )`, [
      new Date().getTime(),
      ids.join()
    ]);
    ctx.body = { code: 200, message: "删除成功" };
  } catch (err) {
    throw new Error(err);
  }
});

router.post("/updUnit", async ctx => {
  try {
    if (!checkRoot(ctx)) {
      return false;
    }

    const data = ctx.request.body.data;
    const check = await query(
      `SELECT * FROM unit WHERE name = ? AND off != 1`,
      [data.name]
    );
    if (check.length !== 0 && check[0].id != data.id) {
      ctx.body = { code: 500, message: `单位 ${data.name} 已存在` };
      return;
    }
    await query(
      `UPDATE unit SET name = ?, sign = ?, updateTime = ? WHERE id = ?`,
      [data.name, data.sign, new Date().getTime(), data.id]
    );
    const result = await query(`SELECT * FROM unit WHERE off != 1 AND id = ?`, [
      data.id
    ]);
    ctx.body = { code: 200, message: "更新成功", result: result };
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = router;

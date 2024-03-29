const express = require("express");
const ExpressError = require("../expressError");
const router = new express.Router();
const db = require("../db");

router.get("/", async function (req, res, next) {
  try {
    const result = await db.query(
      `SELECT id, comp_code, amt, paid, add_date, paid_date FROM invoices`
    );
    return res.json({ invoices: result.rows });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const result = await db.query(
      `SELECT id, comp_code, amt, paid, add_date, paid_date FROM invoices WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      throw new ExpressError(`No such invoice: ${id}`, 404);
    }
    return res.json({ invoice: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    const { comp_code, amt } = req.body;
    const result = await db.query(
      `INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [comp_code, amt]
    );
    return res.status(201).json({ invoice: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    const { amt } = req.body;
    const id = req.params.id;
    const result = await db.query(
      `UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [amt, id]
    );
    if (result.rows.length === 0) {
      throw new ExpressError(`No such invoice: ${id}`, 404);
    }
    return res.json({ invoice: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const result = await db.query(
      `DELETE FROM invoices WHERE id = $1 RETURNING id`,
      [id]
    );
    if (result.rows.length === 0) {
      throw new ExpressError(`No such invoice: ${id}`, 404);
    }
    return res.json({ status: "deleted" });
  } catch (err) {
    return next(err);
  }
});

// router.get("/:id", async function (req, res, next) {
//   try {
//     const id = req.params.id;
//     const result = await db.query(
//       `SELECT i.id, i.comp_code, c.name, c.description, i.amt, i.paid, i.add_date, i.paid_date FROM invoices AS i INNER JOIN companies AS c ON (i.comp_code = c.code) WHERE i.id = $1`
//     );
//     if (result.rows.length === 0) {
//       throw new ExpressError(`No such invoice: ${id}`, 404);
//     }
//     const data = result.rows[0];
//     return res.json({
//       company: {
//         code: data.comp_code,
//         name: data.name,
//         description: data.description,
//         invoices: {
//           id: data.id,
//           amt: data.amt,
//           paid: data.paid,
//           add_date: data.add_date,
//           paid_date: data.paid_date,
//         },
//       },
//     });
//   } catch (err) {
//     return next(err);
//   }
// });

module.exports = router;

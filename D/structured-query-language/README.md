# Structured Query Language (SQL)

Interactive visual guides and educational resources for mastering **Structured Query Language (SQL)**.

---

## 📄 Contents

### 🔹 [SQL Query Anatomy — One Query, Every Clause](./index.html) (`index.html`)
An interactive, blueprint-themed visual breakdown demonstrating how a complete SQL query works under the hood — covering every core clause, execution order, worked examples, contextual mental models, and database side-concepts.

#### Key Features:
- **Written Order vs. Execution Order Toggle**: Switch between how SQL queries are written vs. the logical sequence in which database engines actually execute each clause:
  $$\text{FROM / JOIN} \longrightarrow \text{WHERE} \longrightarrow \text{GROUP BY} \longrightarrow \text{HAVING} \longrightarrow \text{WINDOW} \longrightarrow \text{SELECT} \longrightarrow \text{DISTINCT} \longrightarrow \text{ORDER BY} \longrightarrow \text{LIMIT}$$
- **Interactive Deep-Dive Panel with Context & Worked Examples**:
  - **Contextual Mental Models**: Explains *why* and *when* to use each clause (e.g., mental model for window functions vs. `GROUP BY`, why `WHERE` filters rows while `HAVING` filters aggregate groups).
  - **Worked Code Examples**: Real, output-driven visual code blocks demonstrating input row transformations, intermediate aggregation results, window calculations, subqueries, and index lookups.
  - **Syntax & Gotchas**: Detailed syntax cards highlighting common interview traps (e.g., `COUNT(*)` vs `COUNT(col)`, `LEFT JOIN` filters in `WHERE` vs `ON`, `EXISTS` vs `IN`).
- **Complete SQL Feature & Side-Topic Coverage**:
  - **Core Query Clauses**: `WITH` (CTE), `SELECT`, `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `JOIN` (INNER & LEFT), `WINDOW` (`RANK()`, `AVG() OVER`), `EXISTS` (Correlated Subqueries), `ORDER BY`, `LIMIT`.
  - **Database Engine Wrappers & Architecture**:
    - `EXPLAIN ANALYZE` (Execution Plan inspection & query optimization)
    - `CREATE PROCEDURE` / `BEGIN ... END` (Stored procedures & encapsulation)
    - `BEGIN TRANSACTION` / `COMMIT` / `ROLLBACK` (ACID guarantees, transaction isolation & `FOR UPDATE` / `NOLOCK` locking hints)
    - `B-Tree Indexing` (`idx_products_id` lookup performance)
    - `Database Normalization & Views` (1NF, 2NF, 3NF, standard `CREATE VIEW` vs `MATERIALIZED VIEW`)
    - `Advanced Clause & Expression Coverage` (`QUALIFY` window filtering, `CASE WHEN` conditional aggregates, `COALESCE` / `NULLIF` null-handling, `LATERAL JOIN` / `CROSS APPLY`)
- **Interactive Step-by-Step Execution Walkthrough**: Auto-play or manually step through the query execution sequence with real-time visual line highlighting, interactive closing brackets (`WITH` CTE and `EXISTS` subqueries), and detailed execution phase indicators.
- **Expanded Responsive Blueprint Design**: Custom embedded SQL SVG favicon and wide viewport container layout (`max-width: 1560px`) preventing query wrapping on wide screens for optimal readability.

---

## 🚀 How to View

Open `index.html` in any modern web browser or serve it locally using a simple HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js npx
npx serve .
```

Navigate to `http://localhost:8000/` to explore the interactive guide.

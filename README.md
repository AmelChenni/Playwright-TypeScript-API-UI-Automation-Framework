# 🎭 Enterprise Playwright Automation Framework — TypeScript E2E + API Suite

![Playwright](https://img.shields.io/badge/Playwright-^1.62-blue?style=for-the-badge&logo=playwright)
![TypeScript](https://img.shields.io/badge/TypeScript-Type--Safe-blue?style=for-the-badge&logo=typescript)
![Faker.js](https://img.shields.io/badge/Faker.js-Test_Data-orange?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-Compatible-green?style=for-the-badge&logo=node.js)

A layered, scalable **End-to-End + API Test Automation Framework** built with **Playwright** and **TypeScript**, testing both the UI and REST API of [automationexercise.com](https://automationexercise.com).

---

## 🎯 Framework Highlights

- **Page Object Model (POM):** page elements and actions are fully separated from test specs for a maintainable, scalable architecture.
- **Composable Custom Fixtures:** built with Playwright's `test.extend`, chained together (`mainPage` → `registerLoginPage` → `acountInfoPage`) so each test pulls in exactly the setup it needs — no duplicated boilerplate.
- **Global Authenticated Setup:** a dedicated `setup` project registers a user via the API and logs in once through the UI, then persists the session with `storageState`. Authenticated tests reuse that session instead of logging in from scratch.
- **API + UI in One Framework:** a typed API client layer (`3_API`) covers REST endpoints — registration, login, products, user CRUD — with response and schema assertions, alongside full UI coverage of signup, account creation, product search, filtering, and category navigation.
- **Cart Flow with Business-Logic Validation:** cart tests don't just check for a confirmation toast — product name and price are captured on the listing page and independently cross-checked against the cart page, and quantity changes on the product-detail page are verified to carry through correctly.
- **Test Isolation Under Shared Session:** since authenticated tests share one real, server-side account, the Cart suite runs in serial mode with a deterministic `afterEach` cleanup (navigates directly to the cart and clears it), avoiding cross-test state leakage.
- **Type-Safe, Data-Driven Testing:** strongly typed user/data builders (`UserDetails` interface) powered by Faker.js for dynamic, realistic test data on every run.
- **Test Isolation (Account Data):** API-created users are cleaned up automatically after each test (register → run → delete).

---

## 🧰 Tech Stack

| Tool | Purpose |
| :--- | :--- |
| **Playwright** | End-to-end UI and API test runner |
| **TypeScript** | Static typing for reliable, readable test code |
| **Faker.js** | Dynamic, realistic test data generation |
| **Custom Fixtures** | Reusable, composable test contexts and setup hooks |
| **Playwright HTML Reporter** | Execution reports, traces, and debugging artifacts |

---

## 📂 Project Structure

```text
├── 1_tests/          # Test specs (Signup, Login, Account Info, Products UI/API, User API, Cart)
├── 2_Pages/           # Page Object Model (POM) classes
├── 3_API/             # Typed API client classes (Login, Products, User)
├── 4_Data/            # Test data builders (Faker-based) and static data
├── 5_Fixtures/        # Composable Playwright fixtures (Signup, Login, Account Info)
├── 6_Utils/            # Shared helpers (category/search matching)
├── playwright.config.ts
└── package.json
```

## 🔧 Getting Started

**Prerequisites:** Node.js installed on your system.

```bash
npm install
npx playwright install --with-deps
```

## 🧪 Running the Tests

```bash
npx playwright test                          # run the full suite
npx playwright test --project=chromium-unauth   # unauthenticated UI + API specs
npx playwright test --project=chromium-auth     # authenticated specs (Cart, etc.)
npx playwright show-report                    # open the HTML execution report
```

The report includes pass/fail metrics and, on failure, trace viewer logs for step-by-step debugging.

> **Note:** the suite exercises a shared, real third-party site (automationexercise.com), so running with a high worker count can occasionally trigger slow responses under concurrent load. If the `setup` project times out locally, retry with fewer workers: `npx playwright test --workers=2`.

## ⚙️ Status & Roadmap

Actively maintained. Cart is now covered end-to-end (add to cart, quantity handling, multi-product flow, cart/listing data consistency). Next up: **Checkout** flow, followed by GitHub Actions CI integration.

## 🔗 Links & Contact

- GitHub: [github.com/AmelChenni](https://github.com/AmelChenni)
- LinkedIn: [linkedin.com/in/amel-chenni](https://www.linkedin.com/in/amel-chenni/)
- Email: chenniamel45@gmail.com
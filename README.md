# Budget Books - In Development

![Node.js Workflow](https://github.com/LukasErekson/budget-books/actions/workflows/node.js.yml/badge.svg)

A React web-app for consolidating transaction data and bank account balances. Budget Books aims to be a central place to analyze personal finance in a simple, straightforward way while providing users that want more customization in their analysis tools to dig deeper. It empowers users to take control of their financial data with any degree of granularity that they want.

# Planned Features

The app should allow users to view their personal Balance Sheet and expense reports for specific snapshots in time, defaulting to the current day. There should also be basic visualization tools that allow the user to compare spending and balances across time periods.

## Categorizing Transactions

- Users can categorize transactions individually on the "Categorize Transactions" page.

- Users can use bulk actions when categorizing transactions, either categorizing large batches at a time or deleting large batches of transactions.

  - Users can also "shift+click" to select a range of transactions for the bulk actions.

- 🔴 TODO: Users should be able to edit transaction information when clicking on more details in the transaction.

- 🔴 TODO: Users should get recommendated categories based on a data model trained on their previous transaction data.

## Uploading Financial Information

- On the "Categorize Transactions" page, users are able upload transaction information in the form of `.csv` files. Users may also input individual transactions, one at a time, using a form that appears at the top of the categorization list.

- 🔴 TODO: Users should also be able to create Journal Entries that allow them to input custom transactions line-by-line, balancing all the debits with credits. Each line will then show up as its own transaction.
  - 🤔 Should The transactions link to the original journal entry for editing purposes?

## 🔴 Balance Sheet

The Balance Sheet should show the balances of the Assets, Liabilities, and Equity at a given snapshot of time. Unlike the Expense report, the balances shown are not net changes within a time frame but rather the accumulated balance from the beginning of the account to the given date.

### Comparing Time Frames

- 🔴 TODO: Users should be able to compare timeframes within the balance sheet to track balances over time.

## 🔴 Expense Reports

The Expense Report allows the user to see the net changes in certain accounts (typically income & expenses) over a period of time. This is useful for showing total expenses for a month, where the bulk of the expenses are going, what does net income look like, etc.

### Comparing Time Frames

- 🔴 TODO: Users should be able to compare across multiple timeframes. By default, comparison should be made by the previous year (e.g. - Comparing Dec. 2023 with Dec. 2022). However, this should be fully customizable to allow for variable timeframes, from days, weeks, months, to years.

### Spending Category Visualizations

- 🔴 TODO: Along with the reports, there should be a way to plot/graph the different spending categories. Preferably, this would be interactive and users would be able to compare across several timeframes as well.

# Skills Showcase

Aside from creating a useful application for personal use, this repository is also meant to showcase my abilities as a developer as I learn more about the TypeScript/React ecosystems. In particular, I hope that it showcases my dedication to the following:

- Git
- React.js and several npm packages
- Documentation
  - Readable, maintainable code with comments as necessary
  - Description of the app's functionality/future plans
  - Writing good ticket and issue descriptions for the scope of work
- Testing
  - Writing good unit tests with good coverage
  - Integrating unit tests into the development workflow
- Full-Stack Development
  - Being able to develop front and back end systems concurrently, accounting for changes in either (also see the [Python backend repo](https://github.com/LukasErekson/budget-books-backend))
- CI/CD
  - Use of GitHub Actions to simulate a full CI/CD environment (_Coming Soon..._)

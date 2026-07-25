# ⚡ Zcash RPC Interactive Developer Playground

An interactive, browser-based RPC testbed built for the **Zcash Mini Build Challenge**.

## 🚀 Dual-Mode RPC Architecture
The playground is designed to support both local node requirements and immediate live previewing:

1. **Local Node Mode (`zcashd` / `zebrad`):** Connects to your own local synchronized Zcash full node (usually running at `http://127.0.0.1:8232`) using basic authentication (`username` & `password`).
2. **Cloud Fallback Mode (GetBlock.io):** In case you don't have a fully synced Zcash mainnet node running (which takes up to 48+ hours and 275+ GB of disk space), the application automatically falls back to a hosted Zcash node proxy using GetBlock.io.

---

## ✨ Features

- **Dynamic Connection Detection:** The interface automatically detects and displays the active mode (e.g. `LOCAL NODE` or `GETBLOCK.IO NODE`) and the exact RPC endpoint URL target being queried.
- **One-Click Presets & Categorization:** Over 10 essential Zcash RPC methods grouped into *Blockchain*, *Block Data*, *Mempool*, *Transactions*, and *Network*.
- **Structured Parameter Builder:** Select between a dynamic Form Builder (typed input fields, default values, and helper info) and a Raw JSON Array editor.
- **Dynamic Syntax Validation:** Client-side validation for JSON arrays, presenting error details and preventing invalid executions.
- **GetBlock.io Powered & Secure Proxy:** Connected directly to Zcash Mainnet RPC infrastructure. Injects credentials server-side via `/api/rpc`, keeping tokens and RPC passwords hidden from client scripts and browser inspect panels.
- **Integrated Request History:** Tracks the last 10 requests with latency, parameters, and payloads, allowing rapid reloading of previous requests.
- **API Response Console:** Clean UI showing execution status badges, millisecond timers, response size, syntax-highlighted JSON, and simulated HTTP response headers.
- **Multi-Language Snippet Generator:** Dynamically compiles ready-to-run copyable integration code blocks in `cURL`, `JavaScript (Fetch)`, and `Python (requests)`.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Node Connections:** Native `zcashd` RPC or GetBlock.io Zcash Node Provider

---

## 🏃 Quickstart

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/zcash-rpc-playground.git
   cd zcash-rpc-playground
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment (`.env.local`):**
   Copy the sample environment values. You can configure either **Option A** or **Option B**:

   **Option A: Local Zcash Daemon (zcashd / zebrad)**
   ```env
   ZCASH_RPC_URL=http://127.0.0.1:8232
   ZCASH_RPC_USER=your_rpc_username
   ZCASH_RPC_PASS=your_rpc_password
   ```

4. **Run the local development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Architecture

```
                 Client Browser (Next.js UI / State Manager)
                                      │
                                      │ POST /api/rpc
                                      ▼
                        Next.js API Gateway (Server)
                                      │
         ┌────────────────────────────┴────────────────────────────┐
         │                                                         │
         ▼ (If ZCASH_RPC_URL is configured)                        ▼ (Fallback)
┌─────────────────────────────────┐                       ┌─────────────────────────────────┐
│        Local Zcash Node         │                       │      GetBlock.io RPC Node       │
│  (zcashd/zebrad on localhost)   │                       │      (Zcash Mainnet Core)       │
└─────────────────────────────────┘                       └─────────────────────────────────┘
```

The gateway separates client-side requests from upstream nodes. Sensitive variables (`ZCASH_RPC_PASS`, `GETBLOCK_ZCASH_TOKEN`) are parsed entirely server-side, protecting nodes from unauthorized external access.

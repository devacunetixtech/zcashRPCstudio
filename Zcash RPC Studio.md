# **Product Requirement Document (PRD)**

## **Project Title: Zcash RPC Interactive Developer Playground**

## **1\. Executive Summary & Vision**

The **Zcash RPC Interactive Developer Playground** is a lightweight, web-based developer tool designed to bridge the gap between building on Zcash and understanding its underlying JSON-RPC architecture. Inspired by terminal tools like zebraUtilities and general API clients like Postman, this application enables developers to test, inspect, and evaluate live Zcash network endpoints straight from their browser without running a local full node.  
Powered by **GetBlock.io**, the platform provides pre-configured queries for main Zcash RPC methods, instant cURL generation, performance latency metrics, and clear JSON payload formatting.

## **2\. Target Audience & Primary Use Cases**

* **Hackathon & Buildathon Participants:** Developers needing a fast, hassle-free way to verify node responses, test block parameters, and debug transaction structures.  
* **Web3 Infrastructure Engineers:** Developers looking for standard cURL snippets or code integration boilerplate for Zcash queries.  
* **Blockchain Learners & Researchers:** Tech enthusiasts looking to explore Zcash mainnet stats, mempool state, and consensus parameters without command-line setup.

## **3\. Core Features & Specifications**

### **3.1 Preset Query Selector & Custom Method Execution**

* **Pre-configured Presets:** One-click loadable presets for essential read-only Zcash RPC methods:  
  * getblockchaininfo: Network height, best block hash, difficulty, verification progress.  
  * getmempoolinfo: Unconfirmed transaction counts, memory size, and total fee metrics.  
  * getbestblockhash: Hash of the most recent valid chain block.  
  * getblock: Block details by height or hash string (e.g., \["1384123", 1\]).  
  * getnetworksolps: Estimated network solutions per second (mining hashrate).  
  * getrawmempool: Array of transaction IDs currently waiting in the pool.  
* **Custom Method Execution:** Text field allowing developers to input custom RPC methods and custom JSON arrays for parameters (e.g., \["\<txid\>", 1\] for getrawtransaction).

### **3.2 Developer Utilities & Code Generation**

* **Instant cURL Generator:** Automatically creates a copyable, syntactically correct curl request corresponding to the active UI parameters.  
* **One-Click Copying:** Dedicated copy buttons for generated cURL snippets and output JSON responses.  
* **Execution Latency Tracker:** Measures request duration using high-resolution browser timers (performance.now()) to display round-trip execution speed in milliseconds.

### **3.3 Security & Infrastructure Protection**

* **Server-Side API Proxy Route:** Serverless backend endpoint (/api/rpc) that injects the GetBlock access key server-side. **The key is never exposed to client-side JavaScript or browser network logs.**  
* **Rate-Limit & Error Handling:** Graceful error messages when JSON formatting is invalid or when GetBlock node rate limits are encountered.

## **4\. Technical Architecture**

┌─────────────────────────────────────────────────────────┐  
│                     Client Browser                      │  
│   (Next.js UI / React State / Dynamic cURL Generator)   │  
└────────────────────────────┬────────────────────────────┘  
                             │ POST /api/rpc  
                             ▼  
┌─────────────────────────────────────────────────────────┐  
│                  Next.js API Gateway                    │  
│   (Injects process.env.GETBLOCK\_ZCASH\_TOKEN / Validates) │  
└────────────────────────────┬────────────────────────────┘  
                             │ POST https://go.getblock.io/\<TOKEN\>/  
                             ▼  
┌─────────────────────────────────────────────────────────┐  
│              GetBlock.io Zcash RPC Node                 │  
│              (Zcash Mainnet Node Core)                  │  
└─────────────────────────────────────────────────────────┘

## **5\. Non-Functional Requirements (NFRs)**

* **Performance:** Request overhead added by the proxy route must be $\< 30\\text{ ms}$.  
* **Usability:** Dark-themed UI with clean typography, styled syntax highlighting, and responsive layout (mobile & desktop).  
* **Security:** Strict separation of environment secrets; zero sensitive key exposure on client outputs.

# **Additional Information & Artifacts**

## **1\. Complete File Structure (Next.js App Router)**

zcash-playground/

├── app/

│   ├── api/

│   │   └── rpc/

│   │       └── route.ts       \# Secure Proxy Route to GetBlock

│   ├── favicon.ico

│   ├── globals.css            \# Tailwind / Custom Styling

│   ├── layout.tsx             \# Root Layout

│   └── page.tsx               \# Playground Main Entry Point

├── components/

│   └── ZcashPlayground.tsx    \# Core Interactive Component

├── .env.local                 \# Local Secret Key Storage

├── package.json

└── README.md                  \# Project Documentation & Pitch

## **2\. Extended UI Code with Copy, Timer & Error States**

Below is the extended components/ZcashPlayground.tsx file incorporating request duration timers, clipboard notifications, and detailed error handling:

## **"use client";**

## 

## **import React, { useState } from "react";**

## 

## **type Preset \= {**

##   **name: string;**

##   **method: string;**

##   **defaultParams: string;**

##   **description: string;**

## **};**

## 

## **const PRESETS: Preset\[\] \= \[**

##   **{**

##     **name: "Get Chain Info",**

##     **method: "getblockchaininfo",**

##     **defaultParams: "\[\]",**

##     **description: "Fetch network height, chain tip, difficulty, and consensus rules.",**

##   **},**

##   **{**

##     **name: "Get Mempool Info",**

##     **method: "getmempoolinfo",**

##     **defaultParams: "\[\]",**

##     **description: "View unconfirmed transaction count and memory usage.",**

##   **},**

##   **{**

##     **name: "Get Best Block Hash",**

##     **method: "getbestblockhash",**

##     **defaultParams: "\[\]",**

##     **description: "Get the hash of the latest block on the main chain.",**

##   **},**

##   **{**

##     **name: "Get Block Details",**

##     **method: "getblock",**

##     **defaultParams: '\["1384123", 1\]',**

##     **description: "Inspect block headers, tx hashes, and timestamps by height or hash.",**

##   **},**

##   **{**

##     **name: "Get Network Solutions/s",**

##     **method: "getnetworksolps",**

##     **defaultParams: "\[\]",**

##     **description: "Estimate Zcash mining hashrate (solutions per second).",**

##   **},**

##   **{**

##     **name: "Get Raw Mempool",**

##     **method: "getrawmempool",**

##     **defaultParams: "\[\]",**

##     **description: "Get list of all transaction IDs waiting in mempool.",**

##   **},**

## **\];**

## 

## **export default function ZcashPlayground() {**

##   **const \[selectedMethod, setSelectedMethod\] \= useState(PRESETS\[0\].method);**

##   **const \[paramsInput, setParamsInput\] \= useState(PRESETS\[0\].defaultParams);**

##   **const \[response, setResponse\] \= useState\<any\>(null);**

##   **const \[loading, setLoading\] \= useState(false);**

##   **const \[latency, setLatency\] \= useState\<number | null\>(null);**

##   **const \[copiedCurl, setCopiedCurl\] \= useState(false);**

## 

##   **const handleSelectPreset \= (preset: Preset) \=\> {**

##     **setSelectedMethod(preset.method);**

##     **setParamsInput(preset.defaultParams);**

##     **setResponse(null);**

##     **setLatency(null);**

##   **};**

## 

##   **const executeRPC \= async () \=\> {**

##     **setLoading(true);**

##     **setResponse(null);**

##     **setLatency(null);**

## 

##     **const startTime \= performance.now();**

## 

##     **try {**

##       **let parsedParams \= \[\];**

##       **if (paramsInput.trim()) {**

##         **parsedParams \= JSON.parse(paramsInput);**

##       **}**

## 

##       **const res \= await fetch("/api/rpc", {**

##         **method: "POST",**

##         **headers: { "Content-Type": "application/json" },**

##         **body: JSON.stringify({**

##           **method: selectedMethod,**

##           **params: parsedParams,**

##         **}),**

##       **});**

## 

##       **const data \= await res.json();**

##       **const endTime \= performance.now();**

##       

##       **setLatency(Math.round(endTime \- startTime));**

##       **setResponse(data);**

##     **} catch (err: any) {**

##       **const endTime \= performance.now();**

##       **setLatency(Math.round(endTime \- startTime));**

##       **setResponse({ error: \`Invalid parameter JSON or request failure: ${err.message}\` });**

##     **} finally {**

##       **setLoading(false);**

##     **}**

##   **};**

## 

##   **// Generate Curl snippet for public output**

##   **let parsedForCurl \= \[\];**

##   **try {**

##     **parsedForCurl \= paramsInput.trim() ? JSON.parse(paramsInput) : \[\];**

##   **} catch {**

##     **parsedForCurl \= \[\];**

##   **}**

## 

##   **const generatedCurl \= \`curl \--location \--request POST 'https://go.getblock.io/\<YOUR\_ACCESS\_TOKEN\>/' \\\\**

## **\--header 'Content-Type: application/json' \\\\**

## **\--data-raw '${JSON.stringify({**

##     **jsonrpc: "2.0",**

##     **method: selectedMethod,**

##     **params: parsedForCurl,**

##     **id: "zcash-playground",**

##   **})}'\`;**

## 

##   **const copyToClipboard \= (text: string) \=\> {**

##     **navigator.clipboard.writeText(text);**

##     **setCopiedCurl(true);**

##     **setTimeout(() \=\> setCopiedCurl(false), 2000);**

##   **};**

## 

##   **return (**

##     **\<div className="p-6 max-w-6xl mx-auto space-y-6 text-gray-100 bg-gray-900 rounded-xl my-8 border border-gray-800 shadow-2xl"\>**

##       **\<header className="border-b border-gray-800 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2"\>**

##         **\<div\>**

##           **\<h1 className="text-2xl font-bold text-yellow-500"\>⚡ Zcash RPC Interactive Playground\</h1\>**

##           **\<p className="text-sm text-gray-400 mt-1"\>**

##             **Test and experiment with Zcash JSON-RPC methods live via GetBlock.io**

##           **\</p\>**

##         **\</div\>**

##         **{latency \!== null && (**

##           **\<div className="text-xs bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-full text-yellow-400 font-mono w-fit"\>**

##             **Latency: {latency} ms**

##           **\</div\>**

##         **)}**

##       **\</header\>**

## 

##       **{/\* Preset Selector \*/}**

##       **\<div className="grid grid-cols-2 md:grid-cols-3 gap-3"\>**

##         **{PRESETS.map((p) \=\> (**

##           **\<button**

##             **key={p.method}**

##             **onClick={() \=\> handleSelectPreset(p)}**

##             **className={\`p-3 text-left border rounded-lg transition-all ${**

##               **selectedMethod \=== p.method**

##                 **? "border-yellow-500 bg-yellow-500/10 text-white shadow-md"**

##                 **: "border-gray-800 bg-gray-800/40 hover:border-gray-700 text-gray-300"**

##             **}\`}**

##           **\>**

##             **\<div className="font-semibold text-sm"\>{p.name}\</div\>**

##             **\<div className="text-xs font-mono text-yellow-500/80 mt-1"\>{p.method}\</div\>**

##           **\</button\>**

##         **))}**

##       **\</div\>**

## 

##       **{/\* Inputs \*/}**

##       **\<div className="space-y-4 bg-gray-800/30 p-5 rounded-lg border border-gray-800"\>**

##         **\<div className="grid grid-cols-1 md:grid-cols-2 gap-4"\>**

##           **\<div\>**

##             **\<label className="block text-xs font-semibold uppercase text-gray-400 mb-1"\>**

##               **RPC Method Name**

##             **\</label\>**

##             **\<input**

##               **type="text"**

##               **value={selectedMethod}**

##               **onChange={(e) \=\> setSelectedMethod(e.target.value)}**

##               **className="w-full bg-gray-950 border border-gray-700 rounded p-2.5 text-sm font-mono text-yellow-400 focus:outline-none focus:border-yellow-500"**

##             **/\>**

##           **\</div\>**

## 

##           **\<div\>**

##             **\<label className="block text-xs font-semibold uppercase text-gray-400 mb-1"\>**

##               **Params Array (JSON Format)**

##             **\</label\>**

##             **\<input**

##               **type="text"**

##               **value={paramsInput}**

##               **onChange={(e) \=\> setParamsInput(e.target.value)}**

##               **placeholder="\[\]"**

##               **className="w-full bg-gray-950 border border-gray-700 rounded p-2.5 text-sm font-mono text-white focus:outline-none focus:border-yellow-500"**

##             **/\>**

##           **\</div\>**

##         **\</div\>**

## 

##         **\<button**

##           **onClick={executeRPC}**

##           **disabled={loading}**

##           **className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2.5 px-4 rounded transition-colors disabled:opacity-50"**

##         **\>**

##           **{loading ? "Fetching RPC Data..." : "Execute RPC Request"}**

##         **\</button\>**

##       **\</div\>**

## 

##       **{/\* Output Panel \*/}**

##       **\<div className="grid grid-cols-1 lg:grid-cols-2 gap-4"\>**

##         **{/\* Generated cURL \*/}**

##         **\<div className="space-y-2"\>**

##           **\<div className="flex justify-between items-center"\>**

##             **\<h3 className="text-xs font-semibold uppercase text-gray-400"\>Generated cURL Snippet\</h3\>**

##             **\<button**

##               **onClick={() \=\> copyToClipboard(generatedCurl)}**

##               **className="text-xs bg-gray-800 hover:bg-gray-700 px-2.5 py-1 rounded text-gray-300 border border-gray-700"**

##             **\>**

##               **{copiedCurl ? "Copied\!" : "Copy cURL"}**

##             **\</button\>**

##           **\</div\>**

##           **\<pre className="bg-gray-950 p-4 rounded-lg text-xs font-mono border border-gray-800 text-green-400 overflow-x-auto whitespace-pre-wrap h-72"\>**

##             **{generatedCurl}**

##           **\</pre\>**

##         **\</div\>**

## 

##         **{/\* Response Window \*/}**

##         **\<div className="space-y-2"\>**

##           **\<div className="flex justify-between items-center"\>**

##             **\<h3 className="text-xs font-semibold uppercase text-gray-400"\>JSON Payload Response\</h3\>**

##             **{response && (**

##               **\<button**

##                 **onClick={() \=\> copyToClipboard(JSON.stringify(response, null, 2))}**

##                 **className="text-xs bg-gray-800 hover:bg-gray-700 px-2.5 py-1 rounded text-gray-300 border border-gray-700"**

##               **\>**

##                 **Copy JSON**

##               **\</button\>**

##             **)}**

##           **\</div\>**

##           **\<pre className="bg-gray-950 p-4 rounded-lg text-xs font-mono border border-gray-800 text-blue-300 overflow-x-auto h-72 overflow-y-auto"\>**

##             **{response ? JSON.stringify(response, null, 2\) : "// Execute query to view response output..."}**

##           **\</pre\>**

##         **\</div\>**

##       **\</div\>**

##     **\</div\>**

##   **);**

## **}**

## 

## **3\. GitHub Submission README Template (README.md)**

\# ⚡ Zcash RPC Interactive Developer Playground

An interactive, browser-based RPC testbed built for the \*\*Zcash Mini Build Challenge\*\*.

\#\# 🚀 Features

\- \*\*One-Click Presets:\*\* Query network metrics (\`getblockchaininfo\`, \`getmempoolinfo\`, \`getblock\`, etc.) instantly.

\- \*\*GetBlock.io Powered:\*\* Connected directly to Zcash Mainnet RPC infrastructure.

\- \*\*Live cURL Generator:\*\* Automatically exports standard terminal cURL commands for every user query.

\- \*\*Latency Monitoring:\*\* Benchmarks network response round-trip time in milliseconds.

\- \*\*Secure Architecture:\*\* Uses Next.js API routes to keep API keys secure.

\#\# 🛠️ Tech Stack

\- \*\*Framework:\*\* Next.js (App Router)

\- \*\*Language:\*\* TypeScript

\- \*\*Styling:\*\* Tailwind CSS

\- \*\*Node Provider:\*\* GetBlock.io (Zcash Mainnet RPC)

\#\# 🏃 Quickstart

1\. Clone the repository:

   \`\`\`bash

   git clone \[https://github.com/your-username/zcash-rpc-playground.git\](https://github.com/your-username/zcash-rpc-playground.git)

   cd zcash-rpc-playground

> Install dependencies:  
> Bash  
> npm install

> 2. Create .env.local:  
>    Code snippet  
>    GETBLOCK\_ZCASH\_TOKEN=your\_getblock\_access\_token\_here

> 3. Run local server:  
>    Bash  
>    npm run dev

>    Open http://localhost:3000 in your browser.
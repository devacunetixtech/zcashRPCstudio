"use client";

import React, { useState, useEffect, useMemo } from "react";

// Inline Icons (standard Lucide style)
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const TerminalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5"></polyline>
    <line x1="12" y1="19" x2="20" y2="19"></line>
  </svg>
);

const ZcashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 8h8l-8 8h8" />
    <path d="M12 6v2" />
    <path d="M12 16v2" />
  </svg>
);

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

type ParamField = {
  name: string;
  type: "string" | "number" | "boolean";
  description: string;
};

type Preset = {
  name: string;
  method: string;
  defaultParams: string;
  description: string;
  category: "Blockchain" | "Block Data" | "Mempool" | "Transactions" | "Network";
  paramFields: ParamField[];
};

const PRESETS: Preset[] = [
  {
    name: "Get Blockchain Info",
    method: "getblockchaininfo",
    defaultParams: "[]",
    description: "Fetch network height, chain tip, difficulty, and active upgrades.",
    category: "Blockchain",
    paramFields: []
  },
  {
    name: "Get Best Block Hash",
    method: "getbestblockhash",
    defaultParams: "[]",
    description: "Get the hash of the latest block on the main chain.",
    category: "Blockchain",
    paramFields: []
  },
  {
    name: "Get Block Count",
    method: "getblockcount",
    defaultParams: "[]",
    description: "Get the height of the most-work fully-validated chain.",
    category: "Blockchain",
    paramFields: []
  },
  {
    name: "Get Block Details",
    method: "getblock",
    defaultParams: '["1384123", 1]',
    description: "Inspect block headers, transaction hashes, and metadata by height or block hash.",
    category: "Block Data",
    paramFields: [
      { name: "blockhash / height", type: "string", description: "The block hash (hex) or block height (integer)" },
      { name: "verbosity", type: "number", description: "0 for raw hex, 1 for detailed JSON object, 2 for verbose tx info" }
    ]
  },
  {
    name: "Get Block Hash",
    method: "getblockhash",
    defaultParams: "[1384123]",
    description: "Get the hash of a block at the specified height.",
    category: "Block Data",
    paramFields: [
      { name: "height", type: "number", description: "The block height index" }
    ]
  },
  {
    name: "Get Block Header",
    method: "getblockheader",
    defaultParams: '["000000000003ad432eb6ad06b6eb792ff1ad6754020a597bfbd9c69ad4762c33", true]',
    description: "Retrieve block header information for a given block hash.",
    category: "Block Data",
    paramFields: [
      { name: "hash", type: "string", description: "The block hash string" },
      { name: "verbose", type: "boolean", description: "True for detailed JSON, false for raw hex string" }
    ]
  },
  {
    name: "Get Mempool Info",
    method: "getmempoolinfo",
    defaultParams: "[]",
    description: "View size, memory usage, and fee statistics of the transaction mempool.",
    category: "Mempool",
    paramFields: []
  },
  {
    name: "Get Raw Mempool",
    method: "getrawmempool",
    defaultParams: "[]",
    description: "Get a list of all transaction IDs currently in the mempool.",
    category: "Mempool",
    paramFields: []
  },
  {
    name: "Get Raw Transaction",
    method: "getrawtransaction",
    defaultParams: '["8f18d727b2a6773347b2bdcb4e259e875ec0b4d4b1a457493a74ef1a0b3ad47b2", 1]',
    description: "Retrieve raw transaction hex or parsed JSON details by transaction ID.",
    category: "Transactions",
    paramFields: [
      { name: "txid", type: "string", description: "The transaction ID hash" },
      { name: "verbose", type: "number", description: "0 for raw hex, 1 for verbose JSON representation" }
    ]
  },
  {
    name: "Get Network Sol/s",
    method: "getnetworksolps",
    defaultParams: "[]",
    description: "Estimate network mining hashrate (solutions per second).",
    category: "Network",
    paramFields: []
  },
  {
    name: "Get Peer Info",
    method: "getpeerinfo",
    defaultParams: "[]",
    description: "Get detailed data about each connected network peer node.",
    category: "Network",
    paramFields: []
  },
  {
    name: "Get Connection Count",
    method: "getconnectioncount",
    defaultParams: "[]",
    description: "Get the number of connections to peer nodes.",
    category: "Network",
    paramFields: []
  }
];

type HistoryItem = {
  id: string;
  timestamp: string;
  method: string;
  params: string;
  latency: number | null;
  status: "success" | "error";
  response: any;
  sizeBytes: number;
};

export default function ZcashPlayground() {
  const [selectedMethod, setSelectedMethod] = useState(PRESETS[0].method);
  const [paramsInput, setParamsInput] = useState(PRESETS[0].defaultParams);
  const [formParams, setFormParams] = useState<Record<number, any>>({});
  const [paramsTab, setParamsTab] = useState<"form" | "json">("form");
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"params" | "headers" | "code">("params");
  const [activeCodeLang, setActiveCodeLang] = useState<"curl" | "fetch" | "python">("curl");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [responseSize, setResponseSize] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [nodeProvider, setNodeProvider] = useState<string>("GetBlock.io Node");
  const [nodeTargetUrl, setNodeTargetUrl] = useState<string>("https://go.getblock.io/zcash/");

  // Find active preset
  const activePreset = useMemo(() => {
    return PRESETS.find((p) => p.method === selectedMethod) || {
      name: "Custom Method",
      method: selectedMethod,
      defaultParams: "[]",
      description: "Custom user-defined JSON-RPC method call.",
      category: "Blockchain" as const,
      paramFields: []
    };
  }, [selectedMethod]);

  // Sync Form parameters state when preset changes
  useEffect(() => {
    try {
      const parsed = JSON.parse(paramsInput);
      if (Array.isArray(parsed)) {
        const formVal: Record<number, any> = {};
        parsed.forEach((val, idx) => {
          formVal[idx] = val;
        });
        setFormParams(formVal);
      } else {
        setFormParams({});
      }
    } catch {
      setFormParams({});
    }
  }, [selectedMethod]);

  // Keyboard shortcut handler: Ctrl+Enter or Cmd+Enter to run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        executeRPC();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMethod, paramsInput]);

  const handleSelectPreset = (preset: Preset) => {
    setSelectedMethod(preset.method);
    setParamsInput(preset.defaultParams);
    setResponse(null);
    setLatency(null);
    setHttpStatus(null);
    setResponseSize(0);
    if (preset.paramFields.length > 0) {
      setParamsTab("form");
    } else {
      setParamsTab("json");
    }
  };

  const handleFormParamChange = (index: number, value: any, type: "string" | "number" | "boolean") => {
    const updated = { ...formParams, [index]: value };
    setFormParams(updated);

    const length = activePreset.paramFields?.length || 0;
    const arr = [];
    for (let i = 0; i < length; i++) {
      const field = activePreset.paramFields?.[i];
      let val = updated[i];
      if (val === undefined || val === "") {
        val = field.type === "number" ? 0 : field.type === "boolean" ? false : "";
      }

      if (field.type === "number") {
        const num = Number(val);
        arr.push(isNaN(num) ? 0 : num);
      } else if (field.type === "boolean") {
        arr.push(val === true || val === "true");
      } else {
        arr.push(String(val));
      }
    }
    setParamsInput(JSON.stringify(arr));
  };

  const executeRPC = async () => {
    if (loading) return;
    setLoading(true);
    setResponse(null);
    setLatency(null);
    setHttpStatus(null);
    setResponseSize(0);

    const startTime = performance.now();

    try {
      let parsedParams: any = [];
      if (paramsInput.trim()) {
        parsedParams = JSON.parse(paramsInput);
      }

      const res = await fetch("/api/rpc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: selectedMethod,
          params: parsedParams,
        }),
      });

      const provider = res.headers.get("x-zcash-node-provider") || "Block Node";
      const target = res.headers.get("x-zcash-target-url") || "https://go.getblock.io/zcash/";
      setNodeProvider(provider);
      setNodeTargetUrl(target);

      const data = await res.json();
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      const stringifiedData = JSON.stringify(data);
      const size = new Blob([stringifiedData]).size;

      setLatency(duration);
      setHttpStatus(res.status);
      setResponseSize(size);
      setResponse(data);

      // Add to query history
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        method: selectedMethod,
        params: paramsInput,
        latency: duration,
        status: (data.error || res.status >= 400) ? "error" : "success",
        response: data,
        sizeBytes: size
      };
      setHistory((prev) => [newHistoryItem, ...prev].slice(0, 10));

    } catch (err: any) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      const errorResponse = {
        error: `Request failure: ${err.message}`,
      };
      const size = new Blob([JSON.stringify(errorResponse)]).size;

      setLatency(duration);
      setHttpStatus(502);
      setResponseSize(size);
      setResponse(errorResponse);

      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        method: selectedMethod,
        params: paramsInput,
        latency: duration,
        status: "error",
        response: errorResponse,
        sizeBytes: size
      };
      setHistory((prev) => [newHistoryItem, ...prev].slice(0, 10));
    } finally {
      setLoading(false);
    }
  };

  const restoreHistory = (item: HistoryItem) => {
    setSelectedMethod(item.method);
    setParamsInput(item.params);
    setResponse(item.response);
    setLatency(item.latency);
    setResponseSize(item.sizeBytes);
    setHttpStatus(item.response?.error ? 500 : 200);

    try {
      const parsed = JSON.parse(item.params);
      if (Array.isArray(parsed)) {
        const formVal: Record<number, any> = {};
        parsed.forEach((val, idx) => {
          formVal[idx] = val;
        });
        setFormParams(formVal);
      }
    } catch {}
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Generate Snippets
  const parsedParams = useMemo(() => {
    try {
      return paramsInput.trim() ? JSON.parse(paramsInput) : [];
    } catch {
      return [];
    }
  }, [paramsInput]);

  const snippets = useMemo(() => {
    const rpcPayload = {
      jsonrpc: "2.0",
      method: selectedMethod,
      params: parsedParams,
      id: "zcash-playground",
    };
    const payloadStr = JSON.stringify(rpcPayload, null, 2);

    return {
      curl: `curl --location --request POST 'https://go.getblock.io/<YOUR_ACCESS_TOKEN>/' \\
--header 'Content-Type: application/json' \\
--data-raw '${JSON.stringify(rpcPayload)}'`,

      fetch: `fetch('https://go.getblock.io/<YOUR_ACCESS_TOKEN>/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(${payloadStr.replace(/\n/g, "\n  ")})
})
  .then(res => res.json())
  .then(data => console.log(data));`,

      python: `import requests

url = "https://go.getblock.io/<YOUR_ACCESS_TOKEN>/"
headers = {
    "Content-Type": "application/json"
}
payload = ${payloadStr.replace(/\n/g, "\n  ")}

response = requests.post(url, headers=headers, json=payload)
print(response.json())`
    };
  }, [selectedMethod, parsedParams]);

  // Syntax highlighting for response window
  const highlightedResponse = useMemo(() => {
    if (!response) return "";
    const rawJson = JSON.stringify(response, null, 2);
    
    // HTML Escaping
    let escaped = rawJson
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    const regex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g;
    
    return escaped.replace(regex, (match) => {
      let cls = "rpc-syntax";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "rpc-key";
        } else {
          cls = "rpc-string";
        }
      } else if (/true|false/.test(match)) {
        cls = "rpc-boolean";
      } else if (/null/.test(match)) {
        cls = "rpc-null";
      } else {
        cls = "rpc-number";
      }
      
      if (cls === "rpc-key") {
        const key = match.slice(0, -1);
        return `<span class="${cls}">${key}</span>:`;
      }
      return `<span class="${cls}">${match}</span>`;
    });
  }, [response]);

  // Simulated Headers
  const simulatedHeaders = useMemo(() => {
    const sizeStr = responseSize > 1024 
      ? `${(responseSize / 1024).toFixed(2)} KB` 
      : `${responseSize} Bytes`;

    return {
      "HTTP/1.1": httpStatus === 200 ? "200 OK" : `${httpStatus || 200} OK`,
      "Date": new Date().toUTCString(),
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": sizeStr,
      "Connection": "keep-alive",
      "Keep-Alive": "timeout=5",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Powered-By": "Next.js",
      "X-Response-Time": latency ? `${latency}ms` : "unknown",
      "Server": nodeProvider === "Local Node" ? "Local Zcash Daemon" : "GetBlock.io Proxy Node"
    };
  }, [latency, responseSize, httpStatus, nodeProvider]);

  // Validate JSON string
  const jsonValidation = useMemo(() => {
    if (!paramsInput.trim()) return { valid: true, error: "" };
    try {
      const parsed = JSON.parse(paramsInput);
      if (!Array.isArray(parsed)) {
        return { valid: false, error: "Root must be a JSON array: [param1, param2]" };
      }
      return { valid: true, error: "" };
    } catch (err: any) {
      return { valid: false, error: err.message };
    }
  }, [paramsInput]);

  // Filter presets
  const filteredPresets = useMemo(() => {
    if (!searchQuery.trim()) return PRESETS;
    const query = searchQuery.toLowerCase();
    return PRESETS.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.method.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group presets by category
  const categories = useMemo(() => {
    const groups: Record<string, Preset[]> = {
      Blockchain: [],
      "Block Data": [],
      Mempool: [],
      Transactions: [],
      Network: []
    };
    filteredPresets.forEach((p) => {
      if (groups[p.category]) {
        groups[p.category].push(p);
      }
    });
    return groups;
  }, [filteredPresets]);

  return (
    <div className="flex flex-col h-screen max-h-screen text-zinc-200 overflow-hidden font-sans">
      
      {/* Top Navbar */}
      <header className="border-b border-zinc-900 bg-zinc-950 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <ZcashIcon />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold uppercase tracking-wider text-zinc-100 font-mono">
                Zcash RPC Studio
              </h1>
              <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono px-1.5 py-0.5 rounded">
                v0.1.0
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-medium">
              Interactive JSON-RPC testing client for Zcash Mainnet
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800/80 px-3 py-1.5 rounded-md font-mono">
            <GlobeIcon />
            <span>MODE: {nodeProvider.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Node Online</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Column: Preset Selector & History */}
        <aside className="w-full lg:w-80 border-r border-zinc-900 flex flex-col bg-zinc-950 shrink-0 overflow-hidden">
          
          {/* Method Search */}
          <div className="p-4 border-b border-zinc-900 shrink-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter RPC methods..."
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md pl-9 pr-3 py-1.5 text-xs placeholder-zinc-500 text-zinc-200 focus:outline-none focus:border-zinc-700 transition-colors font-mono"
              />
            </div>
          </div>

          {/* Categorized List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {Object.entries(categories).map(([category, items]) => {
              if (items.length === 0) return null;
              return (
                <div key={category} className="space-y-1">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-2 font-mono">
                    {category}
                  </h3>
                  <div className="space-y-0.5">
                    {items.map((preset) => {
                      const isActive = selectedMethod === preset.method;
                      return (
                        <button
                          key={preset.method}
                          onClick={() => handleSelectPreset(preset)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-all font-mono flex items-center justify-between border ${
                            isActive
                              ? "bg-zinc-900 border-zinc-800 text-amber-400 font-semibold"
                              : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30"
                          }`}
                        >
                          <span>{preset.method}</span>
                          {isActive && (
                            <span className="w-1 h-1 rounded-full bg-amber-400"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            
            {filteredPresets.length === 0 && (
              <div className="text-zinc-600 text-[11px] font-mono text-center py-6">
                No matching RPC methods
              </div>
            )}
          </div>

          {/* History Panel */}
          <div className="border-t border-zinc-900 h-64 shrink-0 flex flex-col bg-zinc-950/80">
            <div className="px-4 py-2.5 border-b border-zinc-900 flex items-center justify-between shrink-0 bg-zinc-950">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                <HistoryIcon />
                <span>Request History</span>
              </div>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="text-[9px] text-zinc-600 hover:text-zinc-400 font-mono"
                >
                  Clear All
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => restoreHistory(item)}
                  className="w-full text-left p-2 rounded border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/35 transition-all text-[11px] font-mono flex flex-col gap-1"
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-zinc-300 font-medium truncate max-w-[140px]">
                      {item.method}
                    </span>
                    <span className={`text-[9px] px-1 rounded-sm ${
                      item.status === "success" 
                        ? "text-emerald-400 bg-emerald-950/30 border border-emerald-900/30" 
                        : "text-rose-400 bg-rose-950/30 border border-rose-900/30"
                    }`}>
                      {item.latency !== null ? `${item.latency}ms` : "Error"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-zinc-500">
                    <span className="truncate max-w-[140px]">{item.params}</span>
                    <span>{item.timestamp}</span>
                  </div>
                </button>
              ))}

              {history.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-zinc-600 text-[11px] font-mono py-8">
                  <span>No queries executed yet</span>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Center Column: Request Workspace */}
        <main className="flex-1 border-r border-zinc-900 flex flex-col bg-zinc-900/10 overflow-y-auto">
          
          {/* Endpoint Header */}
          <div className="p-4 border-b border-zinc-900 bg-zinc-950/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 max-w-[70%]">
              <span className="text-[10px] bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold px-1.5 py-0.5 rounded font-mono shrink-0">
                POST
              </span>
              <span className="text-xs text-zinc-400 font-mono truncate" title={nodeTargetUrl}>
                {nodeTargetUrl}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
              <span className="border border-zinc-800 bg-zinc-900 px-1 py-0.5 rounded">Ctrl + Enter</span>
              <span>to send</span>
            </div>
          </div>

          {/* Preset Info Block */}
          <div className="p-4 border-b border-zinc-900/80 bg-zinc-900/20">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5">
                <InfoIcon />
              </div>
              <div>
                <h2 className="text-xs font-bold text-zinc-200 font-mono">
                  {activePreset.name}
                </h2>
                <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                  {activePreset.description}
                </p>
              </div>
            </div>
          </div>

          {/* Config Tabs */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex border-b border-zinc-900 bg-zinc-950/20 shrink-0">
              <button
                onClick={() => setActiveWorkspaceTab("params")}
                className={`px-4 py-2 text-xs font-mono border-b-2 transition-all ${
                  activeWorkspaceTab === "params"
                    ? "border-amber-500/80 text-amber-400 bg-zinc-900/20"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Params Config
              </button>
              <button
                onClick={() => setActiveWorkspaceTab("headers")}
                className={`px-4 py-2 text-xs font-mono border-b-2 transition-all ${
                  activeWorkspaceTab === "headers"
                    ? "border-amber-500/80 text-amber-400 bg-zinc-900/20"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Headers
              </button>
              <button
                onClick={() => setActiveWorkspaceTab("code")}
                className={`px-4 py-2 text-xs font-mono border-b-2 transition-all ${
                  activeWorkspaceTab === "code"
                    ? "border-amber-500/80 text-amber-400 bg-zinc-900/20"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Client Code
              </button>
            </div>

            {/* Workspace Area */}
            <div className="flex-1 p-4 overflow-y-auto">
              
              {activeWorkspaceTab === "params" && (
                <div className="space-y-4">
                  {/* Parameter Sub-tabs */}
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                      Query Parameters
                    </span>
                    <div className="flex bg-zinc-950 border border-zinc-800 p-0.5 rounded-md">
                      <button
                        onClick={() => setParamsTab("form")}
                        disabled={activePreset.paramFields.length === 0}
                        className={`px-2.5 py-1 text-[10px] font-mono rounded transition-all ${
                          paramsTab === "form"
                            ? "bg-zinc-800 text-zinc-200"
                            : "text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none"
                        }`}
                      >
                        Form Builder
                      </button>
                      <button
                        onClick={() => setParamsTab("json")}
                        className={`px-2.5 py-1 text-[10px] font-mono rounded transition-all ${
                          paramsTab === "json"
                            ? "bg-zinc-800 text-zinc-200"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        JSON Array
                      </button>
                    </div>
                  </div>

                  {/* Form Builder Mode */}
                  {paramsTab === "form" && (
                    <div className="space-y-4">
                      {activePreset.paramFields && activePreset.paramFields.length > 0 ? (
                        activePreset.paramFields.map((field, idx) => (
                          <div key={idx} className="space-y-1.5 p-3 rounded-lg border border-zinc-900 bg-zinc-950/20">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-semibold text-zinc-300 font-mono">{field.name}</span>
                              <span className="text-[9px] text-zinc-500 font-mono uppercase bg-zinc-900 border border-zinc-800 px-1 rounded">
                                {field.type}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-500 leading-normal font-sans">
                              {field.description}
                            </p>
                            {field.type === "boolean" ? (
                              <div className="pt-1 flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`param-${idx}`}
                                  checked={formParams[idx] === true || formParams[idx] === "true"}
                                  onChange={(e) => handleFormParamChange(idx, e.target.checked, "boolean")}
                                  className="w-3.5 h-3.5 rounded bg-zinc-950 border-zinc-800 text-amber-500 focus:ring-amber-500/50 focus:ring-offset-zinc-950"
                                />
                                <label htmlFor={`param-${idx}`} className="text-xs text-zinc-400 font-mono">
                                  {formParams[idx] === true ? "true" : "false"}
                                </label>
                              </div>
                            ) : (
                              <input
                                type={field.type === "number" ? "number" : "text"}
                                value={formParams[idx] !== undefined ? formParams[idx] : ""}
                                onChange={(e) => handleFormParamChange(idx, e.target.value, field.type)}
                                placeholder={`Enter ${field.name}...`}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-800"
                              />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-zinc-500 text-xs font-mono border border-dashed border-zinc-800 rounded-lg">
                          No parameters required for this RPC method.
                        </div>
                      )}
                    </div>
                  )}

                  {/* JSON Editor Mode */}
                  {paramsTab === "json" && (
                    <div className="space-y-2">
                      <div className="relative">
                        <textarea
                          value={paramsInput}
                          onChange={(e) => setParamsInput(e.target.value)}
                          placeholder="[]"
                          rows={6}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-3 text-xs font-mono text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-800 resize-y"
                        />
                      </div>
                      
                      {/* JSON Validation Status */}
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-zinc-500 font-mono">
                          Parameter array must be a valid JSON array format.
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          jsonValidation.valid 
                            ? "text-emerald-400 bg-emerald-950/20 border-emerald-900/40" 
                            : "text-rose-400 bg-rose-950/20 border-rose-900/40"
                        }`}>
                          {jsonValidation.valid ? "VALID JSON ARRAY" : "INVALID JSON ARRAY"}
                        </span>
                      </div>
                      {!jsonValidation.valid && (
                        <div className="text-[10px] text-rose-400 font-mono bg-rose-950/15 border border-rose-950/30 p-2.5 rounded-md mt-2 leading-relaxed">
                          Syntax Error: {jsonValidation.error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeWorkspaceTab === "headers" && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex border-b border-zinc-900 pb-2">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      Request Headers
                    </span>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-900 text-zinc-500 text-[11px]">
                        <th className="py-1.5 font-semibold">Header Key</th>
                        <th className="py-1.5 font-semibold">Header Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/50">
                      <tr>
                        <td className="py-2 text-zinc-400">Content-Type</td>
                        <td className="py-2 text-zinc-300">application/json</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-zinc-400">Accept</td>
                        <td className="py-2 text-zinc-300">application/json</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-zinc-400">Authorization</td>
                        <td className="py-2 text-zinc-500 italic">Bearer Token (Proxy Managed)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeWorkspaceTab === "code" && (
                <div className="space-y-3 flex flex-col h-full min-h-[300px]">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                      Boilerplate Integration
                    </span>
                    <div className="flex bg-zinc-950 border border-zinc-800 p-0.5 rounded-md">
                      <button
                        onClick={() => setActiveCodeLang("curl")}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded transition-all ${
                          activeCodeLang === "curl" ? "bg-zinc-800 text-zinc-200" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        cURL
                      </button>
                      <button
                        onClick={() => setActiveCodeLang("fetch")}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded transition-all ${
                          activeCodeLang === "fetch" ? "bg-zinc-800 text-zinc-200" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        JavaScript
                      </button>
                      <button
                        onClick={() => setActiveCodeLang("python")}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded transition-all ${
                          activeCodeLang === "python" ? "bg-zinc-800 text-zinc-200" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        Python
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative flex-1 group">
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <button
                        onClick={() => copyToClipboard("code", snippets[activeCodeLang])}
                        className="p-1.5 rounded border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-all focus:outline-none focus:ring-1 focus:ring-zinc-700"
                        title="Copy code to clipboard"
                      >
                        {copiedId === "code" ? <CheckIcon /> : <CopyIcon />}
                      </button>
                    </div>
                    <pre className="w-full h-72 bg-zinc-950 p-4 rounded-lg text-[11px] font-mono border border-zinc-800 text-zinc-300 overflow-auto whitespace-pre">
                      {snippets[activeCodeLang]}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Run Block */}
          <div className="p-4 border-t border-zinc-900 bg-zinc-950/40 shrink-0">
            <button
              onClick={executeRPC}
              disabled={loading || !jsonValidation.valid}
              className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold py-2.5 px-4 rounded-md transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-sm font-mono text-xs"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4.5 w-4.5 text-zinc-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Executing RPC Query...</span>
                </>
              ) : (
                <>
                  <PlayIcon />
                  <span>Execute RPC Query</span>
                </>
              )}
            </button>
          </div>
        </main>

        {/* Right Column: Response Workspace */}
        <aside className="w-full lg:w-[480px] xl:w-[560px] flex flex-col bg-zinc-950 shrink-0 overflow-hidden">
          
          {/* Status Header */}
          <div className="p-4 border-b border-zinc-900 flex items-center justify-between shrink-0 bg-zinc-950/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-1.5">
              <TerminalIcon />
              <span>Response Console</span>
            </span>

            {/* Performance Indicators */}
            {response && (
              <div className="flex items-center gap-2 font-mono">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  httpStatus === 200 
                    ? "text-emerald-400 bg-emerald-950/20 border-emerald-900/30" 
                    : "text-rose-400 bg-rose-950/20 border-rose-900/30"
                }`}>
                  {httpStatus === 200 ? "200 OK" : `${httpStatus} ERROR`}
                </span>
                {latency !== null && (
                  <span className="text-[10px] text-zinc-400 border border-zinc-800 bg-zinc-900/50 px-2 py-0.5 rounded-full">
                    {latency} ms
                  </span>
                )}
                {responseSize > 0 && (
                  <span className="text-[10px] text-zinc-400 border border-zinc-800 bg-zinc-900/50 px-2 py-0.5 rounded-full">
                    {responseSize > 1024 
                      ? `${(responseSize / 1024).toFixed(2)} KB` 
                      : `${responseSize} B`}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Response Output Tab selectors */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-zinc-950/20">
            <div className="flex border-b border-zinc-900 bg-zinc-950/40 shrink-0">
              <span className="px-4 py-2.5 text-xs font-mono text-zinc-300 border-b-2 border-amber-500/80">
                Payload JSON
              </span>
              <span className="flex-1"></span>
              {response && (
                <div className="flex items-center pr-3">
                  <button
                    onClick={() => copyToClipboard("json", JSON.stringify(response, null, 2))}
                    className="flex items-center gap-1 text-[10px] font-mono bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 px-2 py-1 rounded transition-colors"
                  >
                    {copiedId === "json" ? (
                      <>
                        <CheckIcon />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon />
                        <span>Copy Response</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Code Response window */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs relative bg-zinc-950/40">
              {loading ? (
                /* Skeleton Loader */
                <div className="space-y-3.5 animate-pulse">
                  <div className="h-4 bg-zinc-900 rounded w-1/4"></div>
                  <div className="h-4 bg-zinc-900 rounded w-1/2"></div>
                  <div className="h-4 bg-zinc-900 rounded w-3/4"></div>
                  <div className="h-4 bg-zinc-900 rounded w-5/6"></div>
                  <div className="h-4 bg-zinc-900 rounded w-2/3"></div>
                  <div className="h-4 bg-zinc-900 rounded w-1/2"></div>
                  <div className="h-4 bg-zinc-900 rounded w-1/3"></div>
                </div>
              ) : response ? (
                <pre className="whitespace-pre overflow-x-auto select-text selection:bg-zinc-800/80 leading-normal">
                  <code dangerouslySetInnerHTML={{ __html: highlightedResponse }} />
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-600 font-mono py-16">
                  <TerminalIcon />
                  <span className="mt-2 text-xs">Execute a request query to display JSON response output</span>
                  <span className="mt-1 text-[10px] text-zinc-700">Client results are proxied securely to GetBlock nodes</span>
                </div>
              )}
            </div>
          </div>

          {/* Response Simulated Headers Table */}
          {response && (
            <div className="border-t border-zinc-900 h-64 shrink-0 flex flex-col bg-zinc-950/80">
              <div className="px-4 py-2 border-b border-zinc-900 shrink-0 bg-zinc-950">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                  Simulated Response Headers
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px]">
                <table className="w-full text-left">
                  <tbody>
                    {Object.entries(simulatedHeaders).map(([key, val]) => (
                      <tr key={key} className="border-b border-zinc-900/40">
                        <td className="py-1 text-zinc-500 font-semibold pr-4 truncate max-w-[150px]">{key}</td>
                        <td className="py-1 text-zinc-300 truncate max-w-[280px]">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </aside>
        
      </div>
    </div>
  );
}

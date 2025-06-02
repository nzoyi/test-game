import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const API_KEYS_URL = "https://galacticbytestudio.com/api/data/apikeys.json";
const USAGE_URL = "https://galacticbytestudio.com/api/data/usage.json";

export default function AdminPanel() {
  const [apiKeys, setApiKeys] = useState({});
  const [usage, setUsage] = useState({});
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const keysRes = await axios.get(API_KEYS_URL);
      const usageRes = await axios.get(USAGE_URL);
      setApiKeys(keysRes.data);
      setUsage(usageRes.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setFormData(apiKeys[client]);
  };

  const handleUpdate = () => {
    // POST updated data to your PHP update endpoint (not shown)
    console.log("Updated", formData);
  };

  const handleDelete = (client) => {
    // POST delete to your PHP delete endpoint (not shown)
    console.log("Deleted", client);
  };

  const handleCreate = () => {
    // POST new client to your PHP create endpoint (not shown)
    console.log("Created", formData);
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">API Key Admin Panel</h1>

      <Tabs defaultValue="manage">
        <TabsList>
          <TabsTrigger value="manage">Manage API Keys</TabsTrigger>
          <TabsTrigger value="usage">Monitor Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="manage">
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(apiKeys).map((client) => (
              <Card key={client}>
                <CardContent className="p-4 space-y-2">
                  <div className="font-semibold">{client}</div>
                  <div className="text-sm">Type: {apiKeys[client].type}</div>
                  <div className="text-xs truncate">
                    Public Key: {apiKeys[client].publicKey}
                  </div>
                  <div className="text-xs truncate">
                    Secret Key: {apiKeys[client].secretKey}
                  </div>
                  <Button size="sm" onClick={() => handleSelectClient(client)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(client)}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedClient && (
            <div className="mt-6 space-y-4">
              <h2 className="text-xl font-bold">Edit {selectedClient}</h2>
              <Input
                value={formData.publicKey || ""}
                onChange={(e) =>
                  setFormData({ ...formData, publicKey: e.target.value })
                }
                placeholder="Public Key"
              />
              <Input
                value={formData.secretKey || ""}
                onChange={(e) =>
                  setFormData({ ...formData, secretKey: e.target.value })
                }
                placeholder="Secret Key"
              />
              <Input
                value={formData.type || ""}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                placeholder="Type (demo/premium)"
              />
              <Button onClick={handleUpdate}>Update Key</Button>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-bold">Create New API Key</h2>
            <Input
              placeholder="Client Name"
              onChange={(e) => setSelectedClient(e.target.value)}
            />
            <Input
              placeholder="Public Key"
              onChange={(e) =>
                setFormData({ ...formData, publicKey: e.target.value })
              }
            />
            <Input
              placeholder="Secret Key"
              onChange={(e) =>
                setFormData({ ...formData, secretKey: e.target.value })
              }
            />
            <Input
              placeholder="Type"
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            />
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </TabsContent>

        <TabsContent value="usage">
          <h2 className="text-xl font-bold mb-4">API Usage Summary</h2>
          <pre className="bg-black text-white p-4 rounded overflow-x-auto text-sm">
            {JSON.stringify(usage, null, 2)}
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}

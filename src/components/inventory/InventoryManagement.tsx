import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Package, Plus, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InventoryManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Sample inventory data
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: "Office Chairs",
      category: "Furniture",
      quantity: 25,
      price: 150,
      status: "In Stock",
      description: "Ergonomic office chairs with lumbar support"
    },
    {
      id: 2,
      name: "Laptops",
      category: "Electronics",
      quantity: 8,
      price: 1200,
      status: "Low Stock",
      description: "Business laptops with 16GB RAM"
    },
    {
      id: 3,
      name: "Desk Lamps",
      category: "Office Supplies",
      quantity: 50,
      price: 35,
      status: "In Stock",
      description: "LED desk lamps with adjustable brightness"
    }
  ]);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    description: ""
  });

  const categories = ["All", "Furniture", "Electronics", "Office Supplies", "Equipment", "Other"];

  const handleAddItem = () => {
    if (newItem.name && newItem.category && newItem.quantity && newItem.price) {
      const item = {
        id: inventory.length + 1,
        name: newItem.name,
        category: newItem.category,
        quantity: parseInt(newItem.quantity),
        price: parseFloat(newItem.price),
        status: parseInt(newItem.quantity) > 10 ? "In Stock" : "Low Stock",
        description: newItem.description
      };
      
      setInventory([...inventory, item]);
      setNewItem({ name: "", category: "", quantity: "", price: "", description: "" });
      
      toast({
        title: "Item Added",
        description: "New inventory item has been added successfully.",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded for processing.`,
      });
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Inventory Management</h2>
          <p className="text-muted-foreground">Track and manage your business inventory</p>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">Current Inventory</TabsTrigger>
          <TabsTrigger value="add">Add Items</TabsTrigger>
          <TabsTrigger value="upload">Upload Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Inventory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>{item.category}</CardDescription>
                    </div>
                    <Badge variant={item.status === "In Stock" ? "default" : "destructive"}>
                      {item.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Quantity</p>
                      <p className="text-2xl font-bold text-primary">{item.quantity}</p>
                    </div>
                    <div>
                      <p className="font-medium">Price</p>
                      <p className="text-lg font-semibold">${item.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Inventory Item</CardTitle>
              <CardDescription>Enter details for a new inventory item</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== "All").map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="Enter price"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter item description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>
              
              <Button onClick={handleAddItem} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Inventory File</CardTitle>
              <CardDescription>Upload a CSV or Excel file to bulk import inventory items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Upload your inventory file</p>
                  <p className="text-sm text-muted-foreground">
                    Supported formats: CSV, XLSX. Max file size: 10MB
                  </p>
                </div>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" className="mt-4">
                    <Package className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </Label>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">File Format Requirements:</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Column 1: Item Name</p>
                  <p>• Column 2: Category</p>
                  <p>• Column 3: Quantity</p>
                  <p>• Column 4: Price</p>
                  <p>• Column 5: Description (optional)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryManagement;
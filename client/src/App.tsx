import type React from "react"
import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Container,
  Box,
  Chip,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Stack,
} from "@mui/material"
import {
  Security as SecurityIcon,
  Storage as StorageIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  Umbrella as UmbrellaIcon,
  Person as PersonIcon,
  CreditCard as CreditCardIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Shield as ShieldIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material"

// Configure axios base URL
axios.defaults.baseURL = "http://localhost:5000/api"
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const initiatePayment = async ({ order, token }: any) => {
  return new Promise((resolve, reject) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Cybersecurity AI Platform",
      description: "Premium Subscription",
      order_id: order.id,
      handler: (response: any) => resolve(response),
      prefill: {
        name: "User",
        email: "user@example.com",
      },
      theme: {
        color: "#6366f1",
      },
    }

    if (typeof window !== "undefined" && (window as any).Razorpay) {
      const rzp = new (window as any).Razorpay(options)
      rzp.on("payment.failed", (response: any) => reject(response.error))
      rzp.open()
    } else {
      reject(new Error("Razorpay not loaded"))
    }
  })
}

const Dashboard = () => {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as any })

  const handlePremiumPurchase = async () => {
    try {
      const token = localStorage.getItem("token")
      const { data } = await axios.post(
        "/payment/create-order",
        { amount: 500 },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      const razorpayResponse: any = await initiatePayment({ order: data.order, token })

      const verifyRes = await axios.post(
        "/payment/verify-payment",
        {
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          amount: 500,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (verifyRes.data.success) {
        setSnackbar({ open: true, message: "Payment successful! Premium activated.", severity: "success" })
      }
    } catch (err) {
      console.error("Payment Error:", err)
      setSnackbar({ open: true, message: "Payment failed or canceled. Please try again.", severity: "error" })
    }
  }

  const dashboardCards = [
    {
      title: "AI Threat Detection",
      description: "Real-time monitoring and alerts for cyber threats using advanced AI algorithms.",
      icon: <WarningIcon sx={{ fontSize: 32 }} />,
      link: "/threats",
      gradient: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
      buttonText: "View Threats",
      stats: "24 Active",
    },
    {
      title: "Asset Management",
      description: "Track and manage your digital assets securely and efficiently.",
      icon: <StorageIcon sx={{ fontSize: 32 }} />,
      link: "/assets",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
      buttonText: "Manage Assets",
      stats: "156 Assets",
    },
    {
      title: "Compliance Tracker",
      description: "Stay on top of regulatory requirements and compliance tasks.",
      icon: <AssignmentIcon sx={{ fontSize: 32 }} />,
      link: "/compliance",
      gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
      buttonText: "View Compliance",
      stats: "85% Complete",
    },
    {
      title: "Insurance Readiness",
      description: "Assess and improve your cyber insurance eligibility and readiness.",
      icon: <UmbrellaIcon sx={{ fontSize: 32 }} />,
      link: "/insurance",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
      buttonText: "Check Readiness",
      stats: "Good Score",
    },
  ]

  const statsCards = [
    {
      title: "Security Score",
      value: "94%",
      change: "+5%",
      icon: <ShieldIcon sx={{ fontSize: 24, color: "#10b981" }} />,
      color: "#10b981",
    },
    {
      title: "Threats Blocked",
      value: "1,247",
      change: "+12%",
      icon: <SecurityIcon sx={{ fontSize: 24, color: "#ef4444" }} />,
      color: "#ef4444",
    },
    {
      title: "Compliance Rate",
      value: "98.5%",
      change: "+2.1%",
      icon: <TrendingUpIcon sx={{ fontSize: 24, color: "#3b82f6" }} />,
      color: "#3b82f6",
    },
    {
      title: "Response Time",
      value: "1.2s",
      change: "-0.3s",
      icon: <SpeedIcon sx={{ fontSize: 24, color: "#f59e0b" }} />,
      color: "#f59e0b",
    },
  ]

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Hero Section */}
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 800,
          }}
        >
          Cybersecurity AI Platform
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
          Empowering Indian Startups & MSMEs with AI-driven Cybersecurity, Compliance, and Insurance Readiness
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={6}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card
              sx={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: stat.color, fontWeight: 600 }}>
                      {stat.change} from last month
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: `${stat.color}15`,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Feature Cards */}
      <Grid container spacing={4}>
        {dashboardCards.map((card, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: card.gradient,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: card.gradient,
                      color: "white",
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Chip
                    label={card.stats}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(99, 102, 241, 0.1)",
                      color: "#6366f1",
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  component={Link}
                  to={card.link}
                  variant="contained"
                  fullWidth
                  sx={{
                    background: card.gradient,
                    py: 1.5,
                    fontWeight: 600,
                  }}
                >
                  {card.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}

        {/* Premium Card */}
        <Grid item xs={12} sm={6} lg={4}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
              color: "white",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -50,
                right: -50,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -30,
                left: -30,
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1, position: "relative", zIndex: 1 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <CreditCardIcon sx={{ fontSize: 32 }} />
                <Chip
                  label="Popular"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                Upgrade to Premium
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                Unlock AI Threat Insights and advanced features with a premium plan.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 3, pt: 0, position: "relative", zIndex: 1 }}>
              <Button
                onClick={handlePremiumPurchase}
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  py: 1.5,
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.3)",
                  },
                }}
              >
                Buy Premium @ ₹500
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

const Assets: React.FC = () => {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editAsset, setEditAsset] = useState<any>(null)
  const [form, setForm] = useState({ name: "", type: "", category: "", description: "" })

  const fetchAssets = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/assets")
      setAssets(res.data)
    } catch (err: any) {
      console.error("Error fetching assets:", err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  const handleOpen = (asset?: any) => {
    if (asset) {
      setEditAsset(asset)
      setForm({
        name: asset.name || "",
        type: asset.type || "",
        category: asset.category || "",
        description: asset.description || "",
      })
    } else {
      setEditAsset(null)
      setForm({ name: "", type: "", category: "", description: "" })
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditAsset(null)
    setForm({ name: "", type: "", category: "", description: "" })
  }

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
  }

  const handleSubmit = async () => {
    try {
      const assetData = {
        ...form,
        type: form.type.toLowerCase(),
        category: form.category.toLowerCase(),
        createdBy: "000000000000000000000000",
        organization: "000000000000000000000000",
      }
      if (editAsset) {
        await axios.put(`/assets/${editAsset._id}`, assetData)
      } else {
        await axios.post("/assets", assetData)
      }
      fetchAssets()
      handleClose()
    } catch (err: any) {
      console.log(err.response?.data)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/assets/${id}`)
      fetchAssets()
    } catch (err: any) {
      console.error("Error deleting asset:", err)
    }
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Assets Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage your digital assets securely
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          size="large"
          sx={{ borderRadius: 3, px: 3 }}
        >
          Add Asset
        </Button>
      </Box>

      <Card sx={{ overflow: "hidden" }}>
        <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6" gutterBottom>
            Your Assets
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and track your digital assets
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.map((asset: any) => (
                  <TableRow key={asset._id} hover sx={{ "&:hover": { backgroundColor: "rgba(99, 102, 241, 0.04)" } }}>
                    <TableCell sx={{ fontWeight: 500 }}>{asset.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={asset.type}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                          color: "#3b82f6",
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={asset.category} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" noWrap>
                        {asset.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleOpen(asset)}
                        sx={{
                          color: "#6366f1",
                          "&:hover": { backgroundColor: "rgba(99, 102, 241, 0.1)" },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(asset._id)}
                        sx={{
                          color: "#ef4444",
                          "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            {editAsset ? "Edit Asset" : "Add New Asset"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {editAsset ? "Update asset information" : "Add a new asset to your inventory"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter asset name"
            />
            <TextField
              fullWidth
              label="Type"
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
              placeholder="Enter asset type"
            />
            <TextField
              fullWidth
              label="Category"
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              placeholder="Enter asset category"
            />
            <TextField
              fullWidth
              label="Description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter asset description"
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {editAsset ? "Update" : "Add"} Asset
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

const Threats: React.FC = () => {
  const [threats, setThreats] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editThreat, setEditThreat] = useState<any>(null)
  const [form, setForm] = useState({ title: "", type: "", category: "", severity: "", status: "", description: "" })

  const fetchThreats = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/threats")
      setThreats(res.data)
    } catch (err: any) {
      console.error("Error fetching threats:", err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchThreats()
  }, [])

  const handleOpen = (threat?: any) => {
    if (threat) {
      setEditThreat(threat)
      setForm({
        title: threat.title || "",
        type: threat.type || "",
        category: threat.category || "",
        severity: threat.severity || "",
        status: threat.status || "",
        description: threat.description || "",
      })
    } else {
      setEditThreat(null)
      setForm({ title: "", type: "", category: "", severity: "", status: "", description: "" })
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditThreat(null)
    setForm({ title: "", type: "", category: "", severity: "", status: "", description: "" })
  }

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
  }

  const handleSubmit = async () => {
    if (!form.description) {
      alert("Description is required.")
      return
    }
    try {
      const threatData = {
        ...form,
        description: form.description,
        reportedBy: "000000000000000000000000",
        organization: "000000000000000000000000",
      }
      if (editThreat) {
        await axios.put(`/threats/${editThreat._id}`, threatData)
      } else {
        await axios.post("/threats", threatData)
      }
      fetchThreats()
      handleClose()
    } catch (err: any) {
      console.log(err.response?.data)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/threats/${id}`)
      fetchThreats()
    } catch (err: any) {
      console.error("Error deleting threat:", err)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return { bg: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }
      case "medium":
        return { bg: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }
      case "low":
        return { bg: "rgba(16, 185, 129, 0.1)", color: "#10b981" }
      default:
        return { bg: "rgba(100, 116, 139, 0.1)", color: "#64748b" }
    }
  }

  const getAIDetectionStatus = (threat: any) => {
    const ai = threat?.aiDetection
    if (!ai || !ai.result) return { status: "Normal", bg: "rgba(16, 185, 129, 0.1)", color: "#10b981" }
    return ai.result === "anomaly"
      ? { status: "Anomaly", bg: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }
      : { status: "Normal", bg: "rgba(16, 185, 129, 0.1)", color: "#10b981" }
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Threat Detection
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and manage security threats with AI-powered detection
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          size="large"
          sx={{ borderRadius: 3, px: 3 }}
        >
          Add Threat
        </Button>
      </Box>

      <Card sx={{ overflow: "hidden" }}>
        <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6" gutterBottom>
            Security Threats
          </Typography>
          <Typography variant="body2" color="text.secondary">
            AI-powered threat detection and monitoring
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Severity</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>AI Detection</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {threats.map((threat: any) => {
                  const aiStatus = getAIDetectionStatus(threat)
                  const severityStyle = getSeverityColor(threat.severity)
                  return (
                    <TableRow
                      key={threat._id}
                      hover
                      sx={{ "&:hover": { backgroundColor: "rgba(99, 102, 241, 0.04)" } }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{threat.title}</TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" noWrap>
                          {threat.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={threat.severity}
                          size="small"
                          sx={{
                            backgroundColor: severityStyle.bg,
                            color: severityStyle.color,
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={aiStatus.status}
                          size="small"
                          variant="outlined"
                          sx={{
                            backgroundColor: aiStatus.bg,
                            color: aiStatus.color,
                            borderColor: aiStatus.color,
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleOpen(threat)}
                          sx={{
                            color: "#6366f1",
                            "&:hover": { backgroundColor: "rgba(99, 102, 241, 0.1)" },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(threat._id)}
                          sx={{
                            color: "#ef4444",
                            "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            {editThreat ? "Edit Threat" : "Report New Threat"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {editThreat ? "Update threat information" : "Report a new security threat"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ pt: 2 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter threat title"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Type"
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value)}
                placeholder="Enter threat type"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Category"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="Enter category"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={form.severity}
                  label="Severity"
                  onChange={(e) => handleChange("severity", e.target.value)}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={form.status} label="Status" onChange={(e) => handleChange("status", e.target.value)}>
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="investigating">Investigating</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Detailed description of the threat"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {editThreat ? "Update" : "Report"} Threat
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

const Compliance: React.FC = () => {
  const [complianceTasks, setComplianceTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editTask, setEditTask] = useState<any>(null)
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
  })

  const fetchComplianceTasks = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/compliance")
      setComplianceTasks(res.data)
    } catch (err: any) {
      console.log("Error fetching compliance tasks:", err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchComplianceTasks()
  }, [])

  const handleOpen = (task?: any) => {
    if (task) {
      setEditTask(task)
      setForm({
        name: task.name || "",
        category: task.category || "",
        description: task.description || "",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        priority: task.priority || "medium",
        status: task.status || "pending",
      })
    } else {
      setEditTask(null)
      setForm({
        name: "",
        category: "",
        description: "",
        dueDate: "",
        priority: "medium",
        status: "pending",
      })
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditTask(null)
    setForm({
      name: "",
      category: "",
      description: "",
      dueDate: "",
      priority: "medium",
      status: "pending",
    })
  }

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
  }

  const handleSubmit = async () => {
    try {
      const taskData = {
        ...form,
        organization: "000000000000000000000000",
        assignedTo: "000000000000000000000000",
      }

      if (editTask) {
        await axios.put(`/compliance/${editTask._id}`, taskData)
      } else {
        await axios.post("/compliance", taskData)
      }
      fetchComplianceTasks()
      handleClose()
    } catch (err: any) {
      console.log("Error saving compliance task:", err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/compliance/${id}`)
      fetchComplianceTasks()
    } catch (err: any) {
      console.log("Error deleting compliance task:", err)
    }
  }

  const handleStatusToggle = async (task: any) => {
    try {
      const newStatus = task.status === "completed" ? "pending" : "completed"
      await axios.put(`/compliance/${task._id}`, { ...task, status: newStatus })
      fetchComplianceTasks()
    } catch (err: any) {
      console.log("Error updating task status:", err)
    }
  }

  const completedTasks = complianceTasks.filter((task: any) => task.status === "completed").length
  const totalTasks = complianceTasks.length
  const compliancePercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return { bg: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }
      case "medium":
        return { bg: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }
      case "low":
        return { bg: "rgba(16, 185, 129, 0.1)", color: "#10b981" }
      default:
        return { bg: "rgba(100, 116, 139, 0.1)", color: "#64748b" }
    }
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Compliance Tracker
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Stay on top of regulatory requirements and compliance tasks
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          size="large"
          sx={{ borderRadius: 3, px: 3 }}
        >
          Add Task
        </Button>
      </Box>

      {/* Progress Card */}
      <Card sx={{ mb: 4, background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", color: "white" }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Overall Compliance Progress
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
            Track your compliance progress across all requirements
          </Typography>

          <Box display="flex" alignItems="center" gap={4}>
            <Box flexGrow={1}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Progress</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {compliancePercentage}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={compliancePercentage}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "white",
                  },
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                {completedTasks} of {totalTasks} tasks completed
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h2" fontWeight="bold">
                {compliancePercentage}%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Complete
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ overflow: "hidden" }}>
        <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6" gutterBottom>
            Compliance Tasks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your regulatory compliance requirements
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Task Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complianceTasks.map((task: any) => {
                  const priorityStyle = getPriorityColor(task.priority)
                  return (
                    <TableRow key={task._id} hover sx={{ "&:hover": { backgroundColor: "rgba(99, 102, 241, 0.04)" } }}>
                      <TableCell sx={{ fontWeight: 500 }}>{task.name}</TableCell>
                      <TableCell>
                        <Chip label={task.category} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                      </TableCell>
                      <TableCell>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.priority}
                          size="small"
                          sx={{
                            backgroundColor: priorityStyle.bg,
                            color: priorityStyle.color,
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={task.status === "completed" ? "contained" : "outlined"}
                          size="small"
                          onClick={() => handleStatusToggle(task)}
                          startIcon={task.status === "completed" ? <CheckCircleIcon /> : <CancelIcon />}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 500,
                          }}
                        >
                          {task.status === "completed" ? "Completed" : "Pending"}
                        </Button>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleOpen(task)}
                          sx={{
                            color: "#6366f1",
                            "&:hover": { backgroundColor: "rgba(99, 102, 241, 0.1)" },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(task._id)}
                          sx={{
                            color: "#ef4444",
                            "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            {editTask ? "Edit Compliance Task" : "Add Compliance Task"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {editTask ? "Update task information" : "Create a new compliance task"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ pt: 2 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter task name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="Enter compliance category"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter task description"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={form.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={form.priority}
                  label="Priority"
                  onChange={(e) => handleChange("priority", e.target.value)}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={form.status} label="Status" onChange={(e) => handleChange("status", e.target.value)}>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {editTask ? "Update" : "Add"} Task
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

const Insurance: React.FC = () => {
  const [insuranceData, setInsuranceData] = useState<any>({
    readiness: 0,
    requirements: [],
    assessments: [],
  })
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editAssessment, setEditAssessment] = useState<any>(null)
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    weight: 10,
    status: "pending",
    notes: "",
  })

  const fetchInsuranceData = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/insurance")
      setInsuranceData(res.data)
    } catch (err: any) {
      console.log("Error fetching insurance data:", err)
      setInsuranceData({
        readiness: 65,
        requirements: [
          "Implement Multi-Factor Authentication (MFA)",
          "Regular Security Training for Employees",
          "Data Backup and Recovery Procedures",
          "Incident Response Plan",
          "Vulnerability Assessment and Penetration Testing",
          "Cyber Security Policy Documentation",
          "Access Control and User Management",
          "Network Security Monitoring",
          "Compliance with Data Protection Regulations",
          "Regular Security Audits",
        ],
        assessments: [],
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchInsuranceData()
  }, [])

  const handleOpen = (assessment?: any) => {
    if (assessment) {
      setEditAssessment(assessment)
      setForm({
        name: assessment.name || "",
        category: assessment.category || "",
        description: assessment.description || "",
        weight: assessment.weight || 10,
        status: assessment.status || "pending",
        notes: assessment.notes || "",
      })
    } else {
      setEditAssessment(null)
      setForm({
        name: "",
        category: "",
        description: "",
        weight: 10,
        status: "pending",
        notes: "",
      })
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditAssessment(null)
    setForm({
      name: "",
      category: "",
      description: "",
      weight: 10,
      status: "pending",
      notes: "",
    })
  }

  const handleChange = (field: string, value: string | number) => {
    setForm({ ...form, [field]: value })
  }

  const handleSubmit = async () => {
    try {
      const assessmentData = {
        ...form,
        organization: "000000000000000000000000",
      }

      if (editAssessment) {
        await axios.put(`/insurance/assessments/${editAssessment._id}`, assessmentData)
      } else {
        await axios.post("/insurance/assessments", assessmentData)
      }
      fetchInsuranceData()
      handleClose()
    } catch (err: any) {
      console.log("Error saving assessment:", err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/insurance/assessments/${id}`)
      fetchInsuranceData()
    } catch (err: any) {
      console.log("Error deleting assessment:", err)
    }
  }

  const handleStatusToggle = async (assessment: any) => {
    try {
      const newStatus = assessment.status === "completed" ? "pending" : "completed"
      await axios.put(`/insurance/assessments/${assessment._id}`, { ...assessment, status: newStatus })
      fetchInsuranceData()
    } catch (err: any) {
      console.log("Error updating assessment status:", err)
    }
  }

  const getReadinessColor = (readiness: number) => {
    if (readiness >= 80) return "#10b981"
    if (readiness >= 60) return "#f59e0b"
    return "#ef4444"
  }

  const getReadinessMessage = (readiness: number) => {
    if (readiness >= 80) return "Excellent! You are well-prepared for cyber insurance."
    if (readiness >= 60) return "Good progress! Focus on completing remaining requirements."
    return "Needs improvement. Prioritize high-impact security measures."
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Insurance Readiness
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Assess and improve your cyber insurance eligibility
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          size="large"
          sx={{ borderRadius: 3, px: 3 }}
        >
          Add Assessment
        </Button>
      </Box>

      {/* Readiness Score Card */}
      <Card sx={{ mb: 4, overflow: "hidden", position: "relative" }}>
        <Box
          sx={{
            background: `linear-gradient(135deg, ${getReadinessColor(insuranceData.readiness)} 0%, ${getReadinessColor(insuranceData.readiness)}80 100%)`,
            color: "white",
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Readiness Assessment
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
            Your current cyber insurance readiness score
          </Typography>

          <Box display="flex" alignItems="center" gap={6}>
            <Box position="relative" display="inline-flex">
              <CircularProgress
                variant="determinate"
                value={insuranceData.readiness}
                size={120}
                thickness={6}
                sx={{
                  color: "white",
                  "& .MuiCircularProgress-circle": {
                    strokeLinecap: "round",
                  },
                }}
              />
              <Box
                position="absolute"
                top={0}
                left={0}
                bottom={0}
                right={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography variant="h3" component="div" fontWeight="bold" color="white">
                  {insuranceData.readiness}%
                </Typography>
              </Box>
            </Box>
            <Box flexGrow={1}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Readiness Score: {insuranceData.readiness}%
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                {getReadinessMessage(insuranceData.readiness)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={insuranceData.readiness}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "white",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Card>

      <Grid container spacing={4} mb={4}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Key Requirements
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Essential security measures for insurance eligibility
              </Typography>

              <List sx={{ p: 0 }}>
                {insuranceData.requirements?.map((req: string, idx: number) => (
                  <ListItem key={idx} sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={req} primaryTypographyProps={{ variant: "body2", fontWeight: 500 }} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Recommendations
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Steps to improve your readiness score
              </Typography>

              <List sx={{ p: 0 }}>
                {[
                  "Complete all pending assessments to improve your readiness score",
                  "Focus on high-weight requirements first for maximum impact",
                  "Document all security measures and maintain compliance records",
                  "Consider engaging with cybersecurity consultants for expert guidance",
                ].map((rec, idx) => (
                  <ListItem key={idx} sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "#3b82f6",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={rec} primaryTypographyProps={{ variant: "body2", fontWeight: 500 }} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ overflow: "hidden" }}>
        <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6" gutterBottom>
            Assessments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track your insurance readiness assessments
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Assessment Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Weight</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {insuranceData.assessments?.map((assessment: any) => (
                  <TableRow
                    key={assessment._id}
                    hover
                    sx={{ "&:hover": { backgroundColor: "rgba(99, 102, 241, 0.04)" } }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{assessment.name}</TableCell>
                    <TableCell>
                      <Chip label={assessment.category} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                    </TableCell>
                    <TableCell>{assessment.weight}%</TableCell>
                    <TableCell>
                      <Button
                        variant={assessment.status === "completed" ? "contained" : "outlined"}
                        size="small"
                        onClick={() => handleStatusToggle(assessment)}
                        startIcon={assessment.status === "completed" ? <CheckCircleIcon /> : <CancelIcon />}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 500,
                        }}
                      >
                        {assessment.status === "completed" ? "Completed" : "Pending"}
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleOpen(assessment)}
                        sx={{
                          color: "#6366f1",
                          "&:hover": { backgroundColor: "rgba(99, 102, 241, 0.1)" },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(assessment._id)}
                        sx={{
                          color: "#ef4444",
                          "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            {editAssessment ? "Edit Assessment" : "Add Assessment"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {editAssessment ? "Update assessment information" : "Create a new insurance readiness assessment"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ pt: 2 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assessment Name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter assessment name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="Enter assessment category"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter assessment description"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Weight (%)"
                type="number"
                inputProps={{ min: 1, max: 100 }}
                value={form.weight}
                onChange={(e) => handleChange("weight", Number.parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={form.status} label="Status" onChange={(e) => handleChange("status", e.target.value)}>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Additional notes"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {editAssessment ? "Update" : "Add"} Assessment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token")
  if (!token) return <Navigate to="/signin" replace />
  return <>{children}</>
}

const SignIn: React.FC = () => {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await axios.post("/auth/login", form)
      localStorage.setItem("token", res.data.data.token)
      setLoading(false)
      navigate("/")
    } catch (err: any) {
      setLoading(false)
      setError(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 420, width: "100%", borderRadius: 4 }}>
        <CardContent sx={{ p: 5 }}>
          <Box textAlign="center" mb={4}>
            <Avatar
              sx={{
                mx: "auto",
                mb: 3,
                width: 64,
                height: 64,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              }}
            >
              <SecurityIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Welcome back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your cybersecurity dashboard
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="email"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="current-password"
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                mb: 3,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                fontWeight: 600,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>
            <Box textAlign="center">
              <Button variant="text" onClick={() => navigate("/signup")} sx={{ fontWeight: 500 }}>
                Don't have an account? Sign up
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

const SignUp: React.FC = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    organization: { name: "", type: "startup", size: "1-10" },
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.startsWith("organization.")) {
      setForm({ ...form, organization: { ...form.organization, [name.split(".")[1]]: value } })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSelectChange = (field: string, value: string) => {
    if (field.startsWith("organization.")) {
      setForm({ ...form, organization: { ...form.organization, [field.split(".")[1]]: value } })
    } else {
      setForm({ ...form, [field]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await axios.post("/auth/register", form)
      localStorage.setItem("token", res.data.data.token)
      setLoading(false)
      navigate("/")
    } catch (err: any) {
      setLoading(false)
      setError(err.response?.data?.message || "Registration failed")
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 520, width: "100%", borderRadius: 4 }}>
        <CardContent sx={{ p: 5 }}>
          <Box textAlign="center" mb={4}>
            <Avatar
              sx={{
                mx: "auto",
                mb: 3,
                width: 64,
                height: 64,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              }}
            >
              <SecurityIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Create account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join our cybersecurity platform
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Organization Name"
                  name="organization.name"
                  value={form.organization.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={form.organization.type}
                    label="Type"
                    onChange={(e) => handleSelectChange("organization.type", e.target.value)}
                  >
                    <MenuItem value="startup">Startup</MenuItem>
                    <MenuItem value="msme">MSME</MenuItem>
                    <MenuItem value="enterprise">Enterprise</MenuItem>
                    <MenuItem value="government">Government</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Size</InputLabel>
                  <Select
                    value={form.organization.size}
                    label="Size"
                    onChange={(e) => handleSelectChange("organization.size", e.target.value)}
                  >
                    <MenuItem value="1-10">1-10</MenuItem>
                    <MenuItem value="11-50">11-50</MenuItem>
                    <MenuItem value="51-200">51-200</MenuItem>
                    <MenuItem value="201-500">201-500</MenuItem>
                    <MenuItem value="500+">500+</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 3,
                py: 1.5,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                fontWeight: 600,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
            </Button>
            <Box textAlign="center">
              <Button variant="text" onClick={() => navigate("/signin")} sx={{ fontWeight: 500 }}>
                Already have an account? Sign in
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: {
      name: "",
      type: "",
      size: "",
    },
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const navigate = useNavigate()

  const fetchUserProfile = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Not logged in")
        setLoading(false)
        return
      }

      const res = await axios.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUser(res.data.user)
      setForm({
        firstName: res.data.user.firstName || "",
        lastName: res.data.user.lastName || "",
        email: res.data.user.email || "",
        phone: res.data.user.phone || "",
        organization: {
          name: res.data.user.organization?.name || "",
          type: res.data.user.organization?.type || "",
          size: res.data.user.organization?.size || "",
        },
      })
    } catch (err: any) {
      console.log("Error fetching user profile:", err)
      setError("Failed to fetch user info")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const handleChange = (field: string, value: string) => {
    if (field.startsWith("organization.")) {
      setForm({
        ...form,
        organization: {
          ...form.organization,
          [field.split(".")[1]]: value,
        },
      })
    } else {
      setForm({ ...form, [field]: value })
    }
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm({ ...passwordForm, [field]: value })
  }

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.put("/users/profile", form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setEditMode(false)
      fetchUserProfile()
    } catch (err: any) {
      console.log("Error updating profile:", err)
    }
  }

  const handlePasswordUpdate = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match")
      return
    }

    try {
      const token = localStorage.getItem("token")
      await axios.put(
        "/users/password",
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setOpen(false)
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      alert("Password updated successfully")
    } catch (err: any) {
      console.log("Error updating password:", err)
      alert("Failed to update password")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/signin")
  }

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )

  if (error)
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
          <Button onClick={() => navigate("/signin")} sx={{ ml: 2 }}>
            Sign In
          </Button>
        </Alert>
      </Container>
    )

  if (!user) return null

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        User Profile
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Stack spacing={4}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Personal Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage your personal details
                    </Typography>
                  </Box>
                  <Button
                    variant={editMode ? "outlined" : "contained"}
                    onClick={() => setEditMode(!editMode)}
                    sx={{ borderRadius: 2 }}
                  >
                    {editMode ? "Cancel" : "Edit Profile"}
                  </Button>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={form.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={form.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      disabled={!editMode}
                    />
                  </Grid>
                </Grid>

                {editMode && (
                  <Box mt={3}>
                    <Button variant="contained" onClick={handleProfileUpdate} sx={{ borderRadius: 2 }}>
                      Save Changes
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Organization Information
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Your organization details
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Organization Name"
                      value={form.organization.name}
                      onChange={(e) => handleChange("organization.name", e.target.value)}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {editMode ? (
                      <FormControl fullWidth>
                        <InputLabel>Organization Type</InputLabel>
                        <Select
                          value={form.organization.type}
                          label="Organization Type"
                          onChange={(e) => handleChange("organization.type", e.target.value)}
                        >
                          <MenuItem value="startup">Startup</MenuItem>
                          <MenuItem value="msme">MSME</MenuItem>
                          <MenuItem value="enterprise">Enterprise</MenuItem>
                          <MenuItem value="government">Government</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField fullWidth label="Organization Type" value={form.organization.type} disabled />
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {editMode ? (
                      <FormControl fullWidth>
                        <InputLabel>Organization Size</InputLabel>
                        <Select
                          value={form.organization.size}
                          label="Organization Size"
                          onChange={(e) => handleChange("organization.size", e.target.value)}
                        >
                          <MenuItem value="1-10">1-10 employees</MenuItem>
                          <MenuItem value="11-50">11-50 employees</MenuItem>
                          <MenuItem value="51-200">51-200 employees</MenuItem>
                          <MenuItem value="201-500">201-500 employees</MenuItem>
                          <MenuItem value="500+">500+ employees</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField fullWidth label="Organization Size" value={form.organization.size} disabled />
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Stack spacing={4}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Account Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Manage your account security
                </Typography>

                <Stack spacing={2}>
                  <Button variant="outlined" fullWidth onClick={() => setOpen(true)} sx={{ borderRadius: 2 }}>
                    Change Password
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    color="error"
                    sx={{ borderRadius: 2 }}
                  >
                    Sign Out
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Account Information
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Your account details
                </Typography>

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      User ID:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "0.75rem",
                        wordBreak: "break-all",
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                        p: 1,
                        borderRadius: 1,
                      }}
                    >
                      {user._id}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Role:
                    </Typography>
                    <Chip
                      label={user.role || "User"}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                        color: "#6366f1",
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Member since:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            Change Password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update your account password
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type={showPasswords.current ? "text" : "password"}
              value={passwordForm.currentPassword}
              onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      edge="end"
                    >
                      {showPasswords.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="New Password"
              type={showPasswords.new ? "text" : "password"}
              value={passwordForm.newPassword}
              onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      edge="end"
                    >
                      {showPasswords.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPasswords.confirm ? "text" : "password"}
              value={passwordForm.confirmPassword}
              onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      edge="end"
                    >
                      {showPasswords.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handlePasswordUpdate} variant="contained">
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

const Navigation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const hideNav = location.pathname === "/signin" || location.pathname === "/signup"

  if (hideNav || !token) return null

  const navItems = [
    { path: "/", label: "Dashboard", icon: DashboardIcon },
    { path: "/assets", label: "Assets", icon: StorageIcon },
    { path: "/threats", label: "Threats", icon: WarningIcon },
    { path: "/compliance", label: "Compliance", icon: AssignmentIcon },
    { path: "/insurance", label: "Insurance", icon: UmbrellaIcon },
    { path: "/profile", label: "Profile", icon: PersonIcon },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/signin")
  }

  return (
    <AppBar position="static" elevation={0} color="transparent">
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 1 }}>
          <Box display="flex" alignItems="center" flexGrow={1}>
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "text.primary",
                mr: 6,
              }}
            >
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "white",
                  mr: 2,
                }}
              >
                <ShieldIcon sx={{ fontSize: 24 }} />
              </Box>
              <Typography variant="h6" component="div" fontWeight="bold">
                CyberSecure AI
              </Typography>
            </Box>
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    startIcon={<Icon />}
                    sx={{
                      color: isActive ? "#6366f1" : "text.primary",
                      backgroundColor: isActive ? "rgba(99, 102, 241, 0.1)" : "transparent",
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      fontWeight: isActive ? 600 : 500,
                      "&:hover": {
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                )
              })}
            </Box>
          </Box>
          <Button
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              color: "text.primary",
              borderRadius: 2,
              fontWeight: 500,
            }}
          >
            Sign Out
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
        <Navigation />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets"
            element={
              <ProtectedRoute>
                <Assets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/threats"
            element={
              <ProtectedRoute>
                <Threats />
              </ProtectedRoute>
            }
          />
          <Route
            path="/compliance"
            element={
              <ProtectedRoute>
                <Compliance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/insurance"
            element={
              <ProtectedRoute>
                <Insurance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
    </BrowserRouter>
  )
}

export default App

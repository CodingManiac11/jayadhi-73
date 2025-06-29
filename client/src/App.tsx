import './axiosConfig';
import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Paper, Box, Alert, CircularProgress, Card, CardContent, Chip } from '@mui/material';
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => (
  <Box sx={{ p: 4 }}>
    <Typography variant="h3" gutterBottom>Cybersecurity AI Platform</Typography>
    <Typography variant="h6" color="text.secondary" gutterBottom>
      Empowering Indian Startups & MSMEs with AI-driven Cybersecurity, Compliance, and Insurance Readiness
    </Typography>
    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5">AI Threat Detection</Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time monitoring and alerts for cyber threats using advanced AI algorithms.
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} component={Link} to="/threats">View Threats</Button>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5">Asset Management</Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage your digital assets securely and efficiently.
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} component={Link} to="/assets">Manage Assets</Button>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5">Compliance Tracker</Typography>
          <Typography variant="body1" color="text.secondary">
            Stay on top of regulatory requirements and compliance tasks.
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} component={Link} to="/compliance">Compliance</Button>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5">Insurance Readiness</Typography>
          <Typography variant="body1" color="text.secondary">
            Assess and improve your cyber insurance eligibility and readiness.
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} component={Link} to="/insurance">Insurance</Button>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

const Assets: React.FC = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editAsset, setEditAsset] = useState<any>(null);
  const [form, setForm] = useState({ name: '', type: '', category: '', description: '' });

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/assets');
      setAssets(res.data);
    } catch (err: any) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleOpen = (asset?: any) => {
    if (asset) {
      setEditAsset(asset);
      setForm({
        name: asset.name || '',
        type: asset.type || '',
        category: asset.category || '',
        description: asset.description || '',
      });
    } else {
      setEditAsset(null);
      setForm({ name: '', type: '', category: '', description: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditAsset(null);
    setForm({ name: '', type: '', category: '', description: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const assetData = {
        ...form,
        type: form.type.toLowerCase(),
        category: form.category.toLowerCase(),
        createdBy: "000000000000000000000000",
        organization: "000000000000000000000000"
      };
      if (editAsset) {
        await axios.put(`/assets/${editAsset._id}`, assetData);
      } else {
        await axios.post('/assets', assetData);
      }
      fetchAssets();
      handleClose();
    } catch (err: any) {
      console.log((err as any).response?.data);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/assets/${id}`);
      fetchAssets();
    } catch (err: any) {
      // handle error
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'type', headerName: 'Type', flex: 1 },
    { field: 'category', headerName: 'Category', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpen(params.row)}><EditIcon /></IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)}><DeleteIcon /></IconButton>
        </>
      ),
      flex: 1,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Assets</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>Add Asset</Button>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={assets}
          columns={columns}
          loading={loading}
          paginationModel={{ page: 0, pageSize: 5 }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          autoHeight
        />
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editAsset ? 'Edit Asset' : 'Add Asset'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">{editAsset ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const Threats: React.FC = () => {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editThreat, setEditThreat] = useState<any>(null);
  const [form, setForm] = useState({ title: '', type: '', category: '', severity: '', status: '', description: '' });
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  const fetchThreats = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/threats');
      setThreats(res.data);
    } catch (err: any) {}
    setLoading(false);
  };
  useEffect(() => { fetchThreats(); }, []);

  const handleOpen = (threat?: any) => {
    if (threat) {
      setEditThreat(threat);
      setForm({
        title: threat.title || '',
        type: threat.type || '',
        category: threat.category || '',
        severity: threat.severity || '',
        status: threat.status || '',
        description: threat.description || '',
      });
    } else {
      setEditThreat(null);
      setForm({ title: '', type: '', category: '', severity: '', status: '', description: '' });
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditThreat(null);
    setForm({ title: '', type: '', category: '', severity: '', status: '', description: '' });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    if (!form.description) {
      alert("Description is required.");
      return;
    }
    try {
      const threatData = {
        ...form,
        description: form.description,
        reportedBy: "000000000000000000000000",
        organization: "000000000000000000000000"
      };
      if (editThreat) {
        await axios.put(`/threats/${editThreat._id}`, threatData);
      } else {
        await axios.post('/threats', threatData);
      }
      fetchThreats();
      handleClose();
    } catch (err: any) {
      console.log((err as any).response?.data);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/threats/${id}`);
      fetchThreats();
    } catch (err: any) {}
  };
  const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    {
      field: 'aiDetectionStatus',
      headerName: 'AI Detection',
      flex: 1,
      renderCell: (params: any) => {
        const ai = params.row?.aiDetection;
        if (!ai || !ai.result) return <span style={{ color: 'green', fontWeight: 'bold' }}>Normal</span>;
        return (
          <span style={{ color: ai.result === 'anomaly' ? 'red' : 'green', fontWeight: 'bold' }}>
            {ai.result === 'anomaly' ? 'Anomaly' : 'Normal'}
          </span>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params: any) => (
        <>
          <IconButton onClick={() => handleOpen(params.row)}><EditIcon /></IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)}><DeleteIcon /></IconButton>
        </>
      ),
    },
  ];
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Threats</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>Add Threat</Button>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={threats}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          autoHeight
        />
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editThreat ? 'Edit Threat' : 'Add Threat'}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Title" name="title" value={form.title} onChange={handleChange} fullWidth required />
          <TextField margin="dense" label="Type" name="type" value={form.type} onChange={handleChange} fullWidth required />
          <TextField margin="dense" label="Category" name="category" value={form.category} onChange={handleChange} fullWidth required />
          <TextField margin="dense" label="Severity" name="severity" value={form.severity} onChange={handleChange} fullWidth required />
          <TextField margin="dense" label="Status" name="status" value={form.status} onChange={handleChange} fullWidth required />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">{editThreat ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const Compliance: React.FC = () => {
  // Mock compliance tasks
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Enable 2FA', status: false },
    { id: 2, name: 'Update Privacy Policy', status: true },
    { id: 3, name: 'Conduct Security Training', status: false },
  ]);
  const handleToggle = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: !t.status } : t));
  };
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Compliance Tracker</Typography>
      <Typography variant="subtitle1" gutterBottom>Overall Compliance: {tasks.filter(t => t.status).length}/{tasks.length} complete</Typography>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <Button variant={task.status ? 'contained' : 'outlined'} color={task.status ? 'success' : 'primary'} onClick={() => handleToggle(task.id)}>
              {task.status ? 'Complete' : 'Incomplete'}
            </Button>
            <span style={{ marginLeft: 8 }}>{task.name}</span>
          </li>
        ))}
      </ul>
    </Box>
  );
};

const Insurance: React.FC = () => {
  const [data, setData] = useState<{ readiness: number, requirements: string[] }>({ readiness: 0, requirements: [] });

  useEffect(() => {
    axios.get('/insurance').then(res => setData(res.data));
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Insurance Readiness</Typography>
      <Typography variant="h6" color="primary" gutterBottom>
        Readiness Score: {data.readiness}%
      </Typography>
      <Typography variant="subtitle1" gutterBottom>Requirements:</Typography>
      <ul>
        {data.requirements.map((req, idx) => <li key={idx}>{req}</li>)}
      </ul>
    </Box>
  );
};

// Helper: ProtectedRoute
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/signin" replace />;
  return <>{children}</>;
};

const SignIn: React.FC = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', form);
      localStorage.setItem('token', res.data.data.token);
      setLoading(false);
      navigate('/');
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Card sx={{ width: 400, p: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">Sign In</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required />
            <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth margin="normal" required />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>
          <Button onClick={() => navigate('/signup')} sx={{ mt: 2 }} fullWidth>Don't have an account? Sign Up</Button>
        </CardContent>
      </Card>
    </Container>
  );
};

const SignUp: React.FC = () => {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', organization: { name: '', type: 'startup', size: '1-10' } });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('organization.')) {
      setForm({ ...form, organization: { ...form.organization, [name.split('.')[1]]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/auth/register', form);
      localStorage.setItem('token', res.data.data.token);
      setLoading(false);
      navigate('/');
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Card sx={{ width: 400, p: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">Sign Up</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} fullWidth margin="normal" required />
            <TextField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} fullWidth margin="normal" required />
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required />
            <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth margin="normal" required />
            <TextField label="Organization Name" name="organization.name" value={form.organization.name} onChange={handleChange} fullWidth margin="normal" required />
            <TextField label="Organization Type" name="organization.type" value={form.organization.type} onChange={handleChange} fullWidth margin="normal" required />
            <TextField label="Organization Size" name="organization.size" value={form.organization.size} onChange={handleChange} fullWidth margin="normal" required />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
          </form>
          <Button onClick={() => navigate('/signin')} sx={{ mt: 2 }} fullWidth>Already have an account? Sign In</Button>
        </CardContent>
      </Card>
    </Container>
  );
};

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not logged in');
      setLoading(false);
      return;
    }
    axios.get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch user info');
        setLoading(false);
      });
  }, []);
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 8 }}>{error} <Button onClick={() => navigate('/signin')}>Sign In</Button></Alert>;
  if (!user) return null;
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>Profile</Typography>
          <Typography>Name: {user.firstName} {user.lastName}</Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Organization: {user.organization?.name}</Typography>
          <Typography>Role: {user.role}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

const App: React.FC = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const hideNav = location.pathname === '/signin' || location.pathname === '/signup';
  return (
    <>
      {!hideNav && token && (
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Cybersecurity AI
            </Typography>
            <Button color="inherit" component={Link} to="/">Dashboard</Button>
            <Button color="inherit" component={Link} to="/assets">Assets</Button>
            <Button color="inherit" component={Link} to="/threats">Threats</Button>
            <Button color="inherit" component={Link} to="/compliance">Compliance</Button>
            <Button color="inherit" component={Link} to="/insurance">Insurance</Button>
            <Button color="inherit" component={Link} to="/profile">Profile</Button>
          </Toolbar>
        </AppBar>
      )}
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
          <Route path="/threats" element={<ProtectedRoute><Threats /></ProtectedRoute>} />
          <Route path="/compliance" element={<ProtectedRoute><Compliance /></ProtectedRoute>} />
          <Route path="/insurance" element={<ProtectedRoute><Insurance /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        </Routes>
      </Container>
    </>
  );
};

export default App; 
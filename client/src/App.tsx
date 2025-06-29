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
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

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
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
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
  const [complianceTasks, setComplianceTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [form, setForm] = useState({ 
    name: '', 
    category: '', 
    description: '', 
    dueDate: '', 
    priority: 'medium',
    status: 'pending'
  });

  const fetchComplianceTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/compliance');
      setComplianceTasks(res.data);
    } catch (err: any) {
      console.log('Error fetching compliance tasks:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComplianceTasks();
  }, []);

  const handleOpen = (task?: any) => {
    if (task) {
      setEditTask(task);
      setForm({
        name: task.name || '',
        category: task.category || '',
        description: task.description || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        priority: task.priority || 'medium',
        status: task.status || 'pending'
      });
    } else {
      setEditTask(null);
      setForm({ 
        name: '', 
        category: '', 
        description: '', 
        dueDate: '', 
        priority: 'medium',
        status: 'pending'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTask(null);
    setForm({ 
      name: '', 
      category: '', 
      description: '', 
      dueDate: '', 
      priority: 'medium',
      status: 'pending'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const taskData = {
        ...form,
        organization: "000000000000000000000000",
        assignedTo: "000000000000000000000000"
      };
      
      if (editTask) {
        await axios.put(`/compliance/${editTask._id}`, taskData);
      } else {
        await axios.post('/compliance', taskData);
      }
      fetchComplianceTasks();
      handleClose();
    } catch (err: any) {
      console.log('Error saving compliance task:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/compliance/${id}`);
      fetchComplianceTasks();
    } catch (err: any) {
      console.log('Error deleting compliance task:', err);
    }
  };

  const handleStatusToggle = async (task: any) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await axios.put(`/compliance/${task._id}`, { ...task, status: newStatus });
      fetchComplianceTasks();
    } catch (err: any) {
      console.log('Error updating task status:', err);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Task Name', flex: 1 },
    { field: 'category', headerName: 'Category', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { 
      field: 'dueDate', 
      headerName: 'Due Date', 
      flex: 1,
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : 'No due date';
      }
    },
    {
      field: 'priority',
      headerName: 'Priority',
      flex: 1,
      renderCell: (params) => {
        const color = params.value === 'high' ? 'error' : params.value === 'medium' ? 'warning' : 'success';
        return <Chip label={params.value} color={color} size="small" />;
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Button
          variant={params.value === 'completed' ? 'contained' : 'outlined'}
          color={params.value === 'completed' ? 'success' : 'primary'}
          size="small"
          onClick={() => handleStatusToggle(params.row)}
        >
          {params.value === 'completed' ? 'Completed' : 'Pending'}
        </Button>
      )
    },
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

  const completedTasks = complianceTasks.filter((task: any) => task.status === 'completed').length;
  const totalTasks = complianceTasks.length;
  const compliancePercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Compliance Tracker</Typography>
      
      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>Overall Compliance</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress 
            variant="determinate" 
            value={compliancePercentage} 
            size={60}
            color={compliancePercentage >= 80 ? 'success' : compliancePercentage >= 60 ? 'warning' : 'error'}
          />
          <Box>
            <Typography variant="h4" color="primary">
              {compliancePercentage}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {completedTasks} of {totalTasks} tasks completed
            </Typography>
          </Box>
        </Box>
      </Box>

      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Add Compliance Task
      </Button>
      
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={complianceTasks}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          paginationModel={{ page: 0, pageSize: 5 }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          autoHeight
        />
      </div>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editTask ? 'Edit Compliance Task' : 'Add Compliance Task'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Task Name"
            name="name"
            value={form.name}
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
            rows={3}
            required
          />
          <TextField
            margin="dense"
            label="Due Date"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            fullWidth
            select
            SelectProps={{ native: true }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </TextField>
          <TextField
            margin="dense"
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            fullWidth
            select
            SelectProps={{ native: true }}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editTask ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const Insurance: React.FC = () => {
  const [insuranceData, setInsuranceData] = useState<any>({
    readiness: 0,
    requirements: [],
    assessments: []
  });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editAssessment, setEditAssessment] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    weight: 10,
    status: 'pending',
    notes: ''
  });

  const fetchInsuranceData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/insurance');
      setInsuranceData(res.data);
    } catch (err: any) {
      console.log('Error fetching insurance data:', err);
      // Set mock data if API fails
      setInsuranceData({
        readiness: 65,
        requirements: [
          'Implement Multi-Factor Authentication (MFA)',
          'Regular Security Training for Employees',
          'Data Backup and Recovery Procedures',
          'Incident Response Plan',
          'Vulnerability Assessment and Penetration Testing',
          'Cyber Security Policy Documentation',
          'Access Control and User Management',
          'Network Security Monitoring',
          'Compliance with Data Protection Regulations',
          'Regular Security Audits'
        ],
        assessments: []
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInsuranceData();
  }, []);

  const handleOpen = (assessment?: any) => {
    if (assessment) {
      setEditAssessment(assessment);
      setForm({
        name: assessment.name || '',
        category: assessment.category || '',
        description: assessment.description || '',
        weight: assessment.weight || 10,
        status: assessment.status || 'pending',
        notes: assessment.notes || ''
      });
    } else {
      setEditAssessment(null);
      setForm({
        name: '',
        category: '',
        description: '',
        weight: 10,
        status: 'pending',
        notes: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditAssessment(null);
    setForm({
      name: '',
      category: '',
      description: '',
      weight: 10,
      status: 'pending',
      notes: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'weight' ? parseInt(value) : value });
  };

  const handleSubmit = async () => {
    try {
      const assessmentData = {
        ...form,
        organization: "000000000000000000000000"
      };
      
      if (editAssessment) {
        await axios.put(`/insurance/assessments/${editAssessment._id}`, assessmentData);
      } else {
        await axios.post('/insurance/assessments', assessmentData);
      }
      fetchInsuranceData();
      handleClose();
    } catch (err: any) {
      console.log('Error saving assessment:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/insurance/assessments/${id}`);
      fetchInsuranceData();
    } catch (err: any) {
      console.log('Error deleting assessment:', err);
    }
  };

  const handleStatusToggle = async (assessment: any) => {
    try {
      const newStatus = assessment.status === 'completed' ? 'pending' : 'completed';
      await axios.put(`/insurance/assessments/${assessment._id}`, { ...assessment, status: newStatus });
      fetchInsuranceData();
    } catch (err: any) {
      console.log('Error updating assessment status:', err);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Assessment Name', flex: 1 },
    { field: 'category', headerName: 'Category', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    {
      field: 'weight',
      headerName: 'Weight (%)',
      flex: 1,
      renderCell: (params) => `${params.value}%`
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Button
          variant={params.value === 'completed' ? 'contained' : 'outlined'}
          color={params.value === 'completed' ? 'success' : 'primary'}
          size="small"
          onClick={() => handleStatusToggle(params.row)}
        >
          {params.value === 'completed' ? 'Completed' : 'Pending'}
        </Button>
      )
    },
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

  const getReadinessColor = (readiness: number) => {
    if (readiness >= 80) return 'success';
    if (readiness >= 60) return 'warning';
    return 'error';
  };

  const getReadinessMessage = (readiness: number) => {
    if (readiness >= 80) return 'Excellent! You are well-prepared for cyber insurance.';
    if (readiness >= 60) return 'Good progress! Focus on completing remaining requirements.';
    return 'Needs improvement. Prioritize high-impact security measures.';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Insurance Readiness</Typography>
      
      <Box sx={{ mb: 3, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Readiness Assessment</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <CircularProgress 
            variant="determinate" 
            value={insuranceData.readiness} 
            size={80}
            color={getReadinessColor(insuranceData.readiness)}
            thickness={4}
          />
          <Box>
            <Typography variant="h3" color={getReadinessColor(insuranceData.readiness)}>
              {insuranceData.readiness}%
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
              {getReadinessMessage(insuranceData.readiness)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Key Requirements</Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {insuranceData.requirements?.map((req: string, idx: number) => (
                <Typography component="li" key={idx} variant="body2" sx={{ mb: 1 }}>
                  {req}
                </Typography>
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Recommendations</Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Complete all pending assessments to improve your readiness score
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Focus on high-weight requirements first for maximum impact
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Document all security measures and maintain compliance records
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Consider engaging with cybersecurity consultants for expert guidance
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Add Assessment
      </Button>
      
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={insuranceData.assessments || []}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          paginationModel={{ page: 0, pageSize: 5 }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          autoHeight
        />
      </div>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editAssessment ? 'Edit Assessment' : 'Add Assessment'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Assessment Name"
            name="name"
            value={form.name}
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
            rows={3}
            required
          />
          <TextField
            margin="dense"
            label="Weight (%)"
            name="weight"
            type="number"
            value={form.weight}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 1, max: 100 }}
            required
          />
          <TextField
            margin="dense"
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            fullWidth
            select
            SelectProps={{ native: true }}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </TextField>
          <TextField
            margin="dense"
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editAssessment ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
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
  const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: {
      name: '',
      type: '',
      size: ''
    }
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not logged in');
        setLoading(false);
        return;
      }
      
      const res = await axios.get('/users/me', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setUser(res.data.user);
      setForm({
        firstName: res.data.user.firstName || '',
        lastName: res.data.user.lastName || '',
        email: res.data.user.email || '',
        phone: res.data.user.phone || '',
        organization: {
          name: res.data.user.organization?.name || '',
          type: res.data.user.organization?.type || '',
          size: res.data.user.organization?.size || ''
        }
      });
    } catch (err: any) {
      console.log('Error fetching user profile:', err);
      setError('Failed to fetch user info');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('organization.')) {
      setForm({ 
        ...form, 
        organization: { 
          ...form.organization, 
          [name.split('.')[1]]: value 
        } 
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/users/profile', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditMode(false);
      fetchUserProfile();
    } catch (err: any) {
      console.log('Error updating profile:', err);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.put('/users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpen(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      alert('Password updated successfully');
    } catch (err: any) {
      console.log('Error updating password:', err);
      alert('Failed to update password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Alert severity="error" sx={{ mt: 8 }}>
      {error} 
      <Button onClick={() => navigate('/signin')} sx={{ ml: 2 }}>
        Sign In
      </Button>
    </Alert>
  );

  if (!user) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>User Profile</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Personal Information</Typography>
              <Button 
                variant={editMode ? 'outlined' : 'contained'} 
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  fullWidth
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  fullWidth
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  disabled={!editMode}
                  margin="normal"
                  type="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  fullWidth
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
            </Grid>

            {editMode && (
              <Box sx={{ mt: 3 }}>
                <Button variant="contained" color="primary" onClick={handleProfileUpdate}>
                  Save Changes
                </Button>
              </Box>
            )}
          </Paper>

          <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Organization Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Organization Name"
                  name="organization.name"
                  value={form.organization.name}
                  onChange={handleChange}
                  fullWidth
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Organization Type"
                  name="organization.type"
                  value={form.organization.type}
                  onChange={handleChange}
                  fullWidth
                  disabled={!editMode}
                  margin="normal"
                  select
                  SelectProps={{ native: true }}
                >
                  <option value="startup">Startup</option>
                  <option value="msme">MSME</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="government">Government</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Organization Size"
                  name="organization.size"
                  value={form.organization.size}
                  onChange={handleChange}
                  fullWidth
                  disabled={!editMode}
                  margin="normal"
                  select
                  SelectProps={{ native: true }}
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </TextField>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Account Settings</Typography>
            
            <Button 
              variant="outlined" 
              fullWidth 
              sx={{ mb: 2 }}
              onClick={() => setOpen(true)}
            >
              Change Password
            </Button>
            
            <Button 
              variant="outlined" 
              color="error" 
              fullWidth
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Account Information</Typography>
            <Box>
              <Typography variant="body2" color="text.secondary">
                User ID: {user._id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Role: {user.role || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Member since: {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handlePasswordUpdate} variant="contained" color="primary">
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
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
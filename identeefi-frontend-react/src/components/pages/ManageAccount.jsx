import { Box, Paper, Typography } from '@mui/material';
import heroBg from '../../img/herobg.png';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageAccount = () => {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        handleData();
    }, []);

    const handleData = async () => {
        try {
            const res = await axios.get('https://final-year-project-133i.onrender.com/profileAll');
            setRows(res.data || []);
        } catch (err) {
            console.error("Failed to load accounts:", err);
        }
    }

    const handleDelete = async (username) => {
        if (!window.confirm(`Are you sure you want to delete user: ${username}?`)) return;
        try {
            await axios.delete(`https://final-year-project-133i.onrender.com/profile/${username}`);
            alert("User deleted successfully!");
            handleData(); // refresh list
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user.");
        }
    }



    const columns = [
        { field: 'name', headerName: 'Name', width: 130, editable: false },
        { field: 'description', headerName: 'Description', width: 250, editable: false },
        { field: 'username', headerName: 'Username', width: 130, editable: false },
        { field: 'website', headerName: 'Website', width: 180, editable: false },
        { field: 'location', headerName: 'Location', width: 180, editable: false },
        { 
            field: 'role', 
            headerName: 'Role', 
            width: 150, 
            editable: false
        },
        { 
            field: 'actions', 
            headerName: 'Actions', 
            width: 180, 
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        size="small"
                        onClick={() => navigate('/add-account', { state: { editUser: params.row } })}
                    >
                        Edit
                    </Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        size="small"
                        onClick={() => handleDelete(params.row.username)}
                    >
                        Delete
                    </Button>
                </Box>
            )
        }
    ];

    const handleBack = () => {
        navigate(-1)
    }

    return (
        <Box sx={{
            backgroundImage: `url(${heroBg})`,
            minHeight: "100vh",
            backgroundRepeat: "no-repeat",
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundSize: 'cover',
            zIndex: -2,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <Paper elevation={3} sx={{ width: "90%", height: "650px", marginTop: "5%", marginBottom: "5%", padding: "3%", backgroundColor: "#161232c4", color: "white" }}>
                <Typography
                    variant="h2"
                    sx={{
                        textAlign: "center", marginBottom: "3%",
                        fontFamily: 'Gambetta', fontWeight: "bold", fontSize: "2.5rem"
                    }}
                >
                    Manage Accounts
                </Typography>
                <Paper sx={{ height: 500, width: '100%', backgroundColor: "#706d82" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        getRowId={(row) => row.id || row._id || row.username}
                    />
                </Paper>
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Button
                        onClick={handleBack}
                        variant="contained"
                        sx={{
                            marginTop: "3%",
                            backgroundColor: "#4c669f",
                            "&:hover": { backgroundColor: "#3b5998" }
                        }}
                    >
                        Back
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default ManageAccount;
import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Chip, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import heroBg from '../../img/herobg.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';

const CONTRACT_ADDRESS = '0x62081f016446585cCC507528cc785980296b4Ccd';

const columns = [
    { field: 'serialNumber', headerName: 'Serial Number', flex: 1, minWidth: 130 },
    { field: 'name', headerName: 'Product Name', flex: 1.2, minWidth: 130 },
    { field: 'brand', headerName: 'Brand', flex: 0.8, minWidth: 90 },
    { field: 'description', headerName: 'Description', flex: 1.5, minWidth: 150 },
    { field: 'manuName', headerName: 'Manufacturer', flex: 1, minWidth: 120 },
    { field: 'manuLocation', headerName: 'Location', flex: 1, minWidth: 120 },
    {
        field: 'manuDate',
        headerName: 'Mfg Date',
        flex: 0.9,
        minWidth: 100,
        valueFormatter: (params) => {
            if (!params.value) return 'â€”';
            const ts = parseInt(params.value);
            if (isNaN(ts)) return params.value;
            return new Date(ts * 1000).toLocaleDateString();
        },
    },
    {
        field: 'txHash',
        headerName: 'Tx Hash',
        flex: 1,
        minWidth: 120,
        renderCell: (params) => {
            if (!params.value) return <span style={{ color: '#888' }}>â€”</span>;
            const short = `${params.value.slice(0, 8)}...${params.value.slice(-6)}`;
            return (
                <a
                    href={`https://sepolia.etherscan.io/tx/${params.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#a78bfa', textDecoration: 'underline', fontSize: '0.82rem' }}
                >
                    {short}
                </a>
            );
        },
    },
    {
        field: 'qr',
        headerName: 'QR',
        flex: 0.7,
        minWidth: 80,
        sortable: false,
        renderCell: (params) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <QRCode
                    value={`${CONTRACT_ADDRESS},${params.row.serialNumber}`}
                    size={52}
                    level="H"
                    includeMargin={true}
                    id={`qr-${params.row.serialNumber}`}
                />
            </Box>
        ),
    },
];

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('https://final-year-project-133i.onrender.com/productAll');
                setProducts(res.data || []);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <Box
            sx={{
                backgroundImage: `url(${heroBg})`,
                minHeight: '100vh',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                position: 'absolute',
                left: 0, right: 0, top: 0, bottom: 0,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pt: 6,
                pb: 8,
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    width: { xs: '95%', md: '90%', lg: '80%' },
                    backgroundColor: '#161232cc',
                    borderRadius: 3,
                    p: 3,
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            color: '#fff',
                            fontFamily: 'Gambetta',
                            fontWeight: 'bold',
                        }}
                    >
                        ðŸ“¦ Products
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Chip
                            label={`${products.length} product${products.length !== 1 ? 's' : ''}`}
                            sx={{ backgroundColor: '#65529d', color: '#fff', fontWeight: 'bold' }}
                        />
                        <Button
                            variant="outlined"
                            size="small"
                            sx={{ color: '#fff', borderColor: '#fff' }}
                            onClick={() => navigate(-1)}
                        >
                            â† Back
                        </Button>
                    </Box>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress sx={{ color: '#fff' }} />
                    </Box>
                ) : error ? (
                    <Typography sx={{ color: 'salmon', textAlign: 'center', py: 4 }}>{error}</Typography>
                ) : products.length === 0 ? (
                    <Typography sx={{ color: '#ccc', textAlign: 'center', py: 6, fontSize: '1.1rem' }}>
                        No products found. Add your first product via <strong>Add Product</strong>.
                    </Typography>
                ) : (
                    <Box sx={{ height: 520 }}>
                        <DataGrid
                            rows={products}
                            columns={columns}
                            getRowId={(row) => row.id || row.serialNumber}
                            rowHeight={72}
                            pageSize={7}
                            rowsPerPageOptions={[7, 15, 30]}
                            sx={{
                                border: 'none',
                                color: '#fff',
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: '#2a1f5c',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    fontSize: '0.95rem',
                                },
                                '& .MuiDataGrid-row': {
                                    backgroundColor: '#1e1650aa',
                                    '&:hover': { backgroundColor: '#2e2a6688' },
                                },
                                '& .MuiDataGrid-cell': {
                                    borderColor: '#3a3060',
                                    color: '#e8e8f8',
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    backgroundColor: '#2a1f5c',
                                    color: '#fff',
                                },
                                '& .MuiTablePagination-root': { color: '#fff' },
                                '& .MuiSvgIcon-root': { color: '#fff' },
                            }}
                        />
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default ProductsPage;

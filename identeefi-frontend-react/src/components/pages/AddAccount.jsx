import '../../css/Role.css'
import { TextField, Box, Paper, Typography, Autocomplete, Button } from '@mui/material';
import React from 'react'
import { useRef, useState, useEffect } from 'react';
import heroBg from '../../img/herobg.png';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const options = ["manufacturer", "supplier", "retailer"]
{console.log("hellp")}

const AddAccount = () => {
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwd2, setPwd2] = useState('');
    const [role, setRole] = React.useState(options[0])
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState('');
    const [location, setLocation] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [image, setImage] = useState({
        file: [],
        filepreview: null
    });
    
    const errRef = useRef();
    const navigate = useNavigate();
    const locationRouter = useLocation();
    const editUser = locationRouter.state?.editUser;
    const isEditMode = !!editUser;

    useEffect(() => {
        if (isEditMode) {
            setUser(editUser.username || '');
            setRole(editUser.role || options[0]);
            setName(editUser.name || '');
            setDescription(editUser.description || '');
            setWebsite(editUser.website || '');
            setLocation(editUser.location || '');
            // password left blank unless changing
        }
    }, [editUser, isEditMode]);
    useEffect(() => {
        setErrMsg('');
    }, [user, pwd]);

    const handleImage = async (e) => {
        setImage({
            ...image,
            file: e.target.files[0],
            filepreview: URL.createObjectURL(e.target.files[0])
        })
    }

    // to upload image
    const uploadImage = async (image) => {
        const data = new FormData();
        data.append("image", image.file);
      try {
        
      
        axios.post("https://final-year-project-133i.onrender.com/upload/profile", data, {
            headers: { "Content-Type": "multipart/form-data" }
        }).then(res => {
            if (res.data.success === 1) {
            }
        })

    }catch (error) {
        console.error("Error uploading image", error);

        }
    }

    const handleBack = () => {
        navigate(-1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // for debugging only
        try {
            const profileData = {
                "username": user,
                "name": name,
                "description": description,
                "website": website,
                "location": location,
                "image": image.file?.name || (isEditMode ? editUser.image : ''),
                "role" : role
            };

            if (isEditMode) {
                if (pwd) profileData.password = pwd; // Optional password update
                const res = await axios.put(`https://final-year-project-133i.onrender.com/profile/${user}`, profileData,
                    { headers: {'Content-Type': 'application/json'} }
                );
                if (image.file && image.file.name) {
                    uploadImage(image);
                }
                alert("Account updated successfully!");
                navigate('/manage-account');
            } else {
                const accountData = JSON.stringify({
                    "username": user,
                    "password": pwd,
                    "role": role
                });
                const res = await axios.post('https://final-year-project-133i.onrender.com/addaccount', accountData,
                    { headers: {'Content-Type': 'application/json'} });
                const res2 = await axios.post('https://final-year-project-133i.onrender.com/addprofile', profileData,
                    { headers: {'Content-Type': 'application/json'} });
                if (image.file && image.file.name) {
                    uploadImage(image);
                }
                alert("Account created successfully!");
            }
            
            
            setUser('');
            setPwd('');
            setPwd2('');
            setRole(options[0]);
            setName('');
            setDescription('');
            setWebsite('');
            setLocation('');
            setImage({
                file: [],
                filepreview: null
            });

        } catch (err) {
            if (!err?.response) {
                setErrMsg('Server is down. Please try again later.');
            } else if (err.response?.status === 400) {
                setErrMsg('Invalid username or password.');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized access.');
            } else {
                setErrMsg('Login Failed. Please try again later.');
            }
            errRef.current.focus();
        }

    };


    return (
        <Box
            sx={{
                backgroundImage: `url(${heroBg})`,
                minHeight: "100vh",
                backgroundRepeat: "no-repeat",
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundSize: "cover",
                zIndex: -2,
                overflowY: "scroll",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: { xs: "90%", sm: "80%", md: "400px" },
                    margin: "auto",
                    marginTop: "4%",
                    marginBottom: "10%",
                    padding: "3%",
                    backgroundColor: "#161232c4",
                }}
            >
                <p
                    ref={errRef}
                    className={errMsg ? "errmsg" : "offscreen"}
                    aria-live="assertive"
                >
                    {errMsg}
                </p>

                <Typography
                    variant="h2"
                    sx={{
                        textAlign: "center",
                        marginBottom: "3%",
                        fontFamily: "Gambetta",
                        fontWeight: "bold",
                        fontSize: { xs: "1.8rem", sm: "2.5rem" },
                        color: "white"
                    }}
                >
                    Add Account
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        id={isEditMode ? "outlined-disabled" : "username"}
                        margin="normal"
                        label="Username"
                        variant="outlined"
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                        disabled={isEditMode}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#fff",
                                    opacity: 0.5,
                                },
                                "&:hover fieldset": {
                                    borderColor: "#fff",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#fff",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "#fff",
                            },
                            "& .MuiInputBase-input": {
                                color: "#fff",
                                opacity: 1,
                            },
                            "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "#fff",
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        id="password"
                        margin="normal"
                        label="Password"
                        type="password"
                        variant="outlined"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required={!isEditMode}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#fff",
                                    opacity: 0.5,
                                },
                                "&:hover fieldset": {
                                    borderColor: "#fff",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#fff",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "#fff",
                            },
                            "& .MuiInputBase-input": {
                                color: "#fff",
                                opacity: 1,
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        id="confirm-password"
                        margin="normal"
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        onChange={(e) => setPwd2(e.target.value)}
                        value={pwd2}
                        required={!isEditMode && pwd.length > 0}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#fff",
                                    opacity: 0.5,
                                },
                                "&:hover fieldset": {
                                    borderColor: "#fff",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#fff",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "#fff",
                            },
                            "& .MuiInputBase-input": {
                                color: "#fff",
                                opacity: 1,
                            },
                        }}
                    />

                    {pwd === pwd2 ? null : (
                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: "center",
                                fontSize: "12px",
                                color: "red",
                            }}
                        >
                            Passwords do not match
                        </Typography>
                    )}

                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={options}
                        fullWidth
                        value={role}
                        onChange={(event, newRole) => {
                            setRole(newRole);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                id="role"
                                margin="normal"
                                label="Role"
                                variant="outlined"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#fff",
                                            opacity: 0.5,
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#fff",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#fff",
                                        },
                                    },
                                    "& .MuiInputLabel-root": {
                                        color: "#fff",
                                    },
                                    "& .MuiInputBase-input": {
                                        color: "#fff",
                                        opacity: 1,
                                    },
                                }}
                            />
                        )}
                    />

                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ marginTop: "3%" }}
                    >
                        Upload Image
                    
                        <input type="file" hidden onChange={handleImage} />
                    </Button>

                    {image.filepreview !== null ? (
                        <img
                            src={image.filepreview}
                            alt="preview"
                            style={{ width: "100%", height: "100%" }}
                        />
                    ) : null}

                    <TextField
                        fullWidth
                        id="name"
                        margin="normal"
                        label="Name"
                        variant="outlined"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#fff",
                                    opacity: 0.5,
                                },
                                "&:hover fieldset": {
                                    borderColor: "#fff",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#fff",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "#fff",
                            },
                            "& .MuiInputBase-input": {
                                color: "#fff",
                                opacity: 1,
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        id="description"
                        margin="normal"
                        label="Description"
                        variant="outlined"
                        multiline
                        minRows={2}
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#fff",
                                    opacity: 0.5,
                                },
                                "&:hover fieldset": {
                                    borderColor: "#fff",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#fff",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "#fff",
                            },
                            "& .MuiInputBase-input": {
                                color: "#fff",
                                opacity: 1,
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        id="website"
                        margin="normal"
                        label="Website"
                        variant="outlined"
                        onChange={(e) => setWebsite(e.target.value)}
                        value={website}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#fff",
                                    opacity: 0.5,
                                },
                                "&:hover fieldset": {
                                    borderColor: "#fff",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#fff",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "#fff",
                            },
                            "& .MuiInputBase-input": {
                                color: "#fff",
                                opacity: 1,
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        id="location"
                        margin="normal"
                        label="Location"
                        variant="outlined"
                        onChange={(e) => setLocation(e.target.value)}
                        value={location}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#fff",
                                    opacity: 0.5,
                                },
                                "&:hover fieldset": {
                                    borderColor: "#fff",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#fff",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "#fff",
                            },
                            "& .MuiInputBase-input": {
                                color: "#fff",
                                opacity: 1,
                            },
                        }}
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        sx={{
                            width: "100%",
                            marginTop: "3%",
                            fontSize: "1.2rem",
                            backgroundColor: "#65529d",
                            "&:hover": { backgroundColor: "#618dbd" },
                        }}
                    >
                        {isEditMode ? "Update" : "Add Account"}
                    </Button>

                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            onClick={handleBack}
                            sx={{
                                marginTop: "5%",
                                backgroundColor: "#D1D8F0",
                                color: "#4B0082",
                                fontSize: "1.2rem",
                                padding: "5px 32px",
                                borderRadius: "8px",
                                "&:hover": {
                                    backgroundColor: "#A9A9A9",
                                    color: "#000000",
                                },
                            }}
                        >
                            Back
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}

export default AddAccount;
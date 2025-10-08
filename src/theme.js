import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#030213',
            light: '#717182',
            dark: '#030213',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ececf0',
            light: '#f3f3f5',
            dark: '#cbced4',
            contrastText: '#030213',
        },
        error: {
            main: '#d4183d',
            contrastText: '#ffffff',
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        },
        text: {
            primary: '#1a1a1a', // oklch(0.145 0 0) converted to hex
            secondary: '#717182',
        },
        divider: 'rgba(0, 0, 0, 0.1)',
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h4: {
            fontWeight: 500,
            fontSize: '1.5rem',
            lineHeight: 1.5,
        },
        h6: {
            fontWeight: 500,
            lineHeight: 1.5,
        },
        body1: {
            fontWeight: 400,
            lineHeight: 1.5,
        },
        body2: {
            fontWeight: 400,
            lineHeight: 1.5,
        },
        button: {
            fontWeight: 500,
            lineHeight: 1.5,
        },
    },
    shape: {
        borderRadius: 10, // 0.625rem = 10px
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    padding: '10px 24px',
                    borderRadius: '0.625rem',
                },
                contained: {
                    backgroundColor: '#030213',
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: '#030213',
                        opacity: 0.9,
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f3f3f5',
                        borderRadius: '0.625rem',
                        '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.1)',
                        },
                        '&:hover fieldset': {
                            borderColor: '#030213',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#030213',
                            borderWidth: '2px',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        fontWeight: 500,
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '0.625rem',
                },
                elevation24: {
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: '0.625rem',
                },
                standardError: {
                    backgroundColor: '#fef2f2',
                    color: '#d4183d',
                    borderColor: '#fecaca',
                    border: '1px solid',
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: '#cbced4',
                    '&.Mui-checked': {
                        color: '#030213',
                    },
                },
            },
        },
    },
});

export default theme;
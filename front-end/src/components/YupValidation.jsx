import * as Yup from 'yup';

export const YupValidation = 
    Yup.object({
        name:Yup.string()
            .required('Full Name is required')
            .matches(/^[a-zA-Z\s]+$/, "Full Name can only contain letters and spaces"),
        
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        
        password: Yup.string()
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters'),

        password_confirmation: Yup.string()
                .oneOf([Yup.ref('password'),null], 'Passwords must match')
                .required('Confirm Password is required')
    });
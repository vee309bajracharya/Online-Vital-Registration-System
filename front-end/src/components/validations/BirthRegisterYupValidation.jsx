import * as Yup from 'yup';

export const BirthRegisterYupValidation = {
    1: Yup.object({
        full_name_en: Yup.string().required('Child name is required'),
        full_name_np: Yup.string().required('Child name in Nepali is required'),
        gender: Yup.string().required('Gender is required'),
        dob_en: Yup.date().required('Date of birth is required'),
        dob_np: Yup.string().required('Nepali date of birth is required'),
    }),

    2: Yup.object({
        birth_place_en: Yup.string().required('Birth place in English is required'),
        birth_place_np: Yup.string().required('Birth place in Nepali is required'),
    }),

    3: Yup.object({
        grandfather_name_en: Yup.string().required("Grandfather name is required"),
        grandfather_name_np: Yup.string().required("Grandfather name in Nepali is required"),

        parents: Yup.array()
            .of(
                Yup.object({
                    parent_type: Yup.string().required("Parent type is required"),
                    full_name_en: Yup.string().required("Parent name is required"),
                    full_name_np: Yup.string().required("Parent name in Nepali is required"),
                    citizenship_number_en: Yup.string().required("Citizenship number is required"),
                    citizenship_number_np: Yup.string().required("Citizenship number in Nepali is required"),
                })
            )
            .min(2, "Both parents details are required"),
    }),


    4: Yup.object({
        province_en: Yup.string().required('Province is required'),
        province_np: Yup.string().required('Province in Nepali is required'),
        district_en: Yup.string().required('District is required'),
        district_np: Yup.string().required('District in Nepali is required'),
        municipality_en: Yup.string().required('Municipality is required'),
        municipality_np: Yup.string().required('Municipality in Nepali is required'),
        ward_number: Yup.string().required('Ward number is required'),
    }),

    5: Yup.object({
        informant_name_en: Yup.string().required('Informant name is required'),
        informant_name_np: Yup.string().required('Informant name in Nepali is required'),
        citizenship_number_en: Yup.string().required('Citizenship number is required'),
        citizenship_number_np: Yup.string().required('Citizenship number in Nepali is required'),
    }),
}
import React, { useEffect, useState } from "react";
import { Divider } from "antd";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";


function NewPatientForm() {
 const { mepz_Code } = useParams();
  const location = useLocation();

  
  const initialFormData= {
    mepz_Code: "",
    name: "",
    company_Name: "",
    age: "",
    gender: "",
    dob: "",
    marital_Status: "",
    mobile: "",
    family_Diabetics: false,
    family_Hypertension: false,
    family_Heart_Disease: false,
    family_Arthritis: false,
    family_Tuberculosis: false,
    family_Asthma: false,
    family_Cancer: false,
    family_Epilepsy: false,
    family_Mentaor_Nervous_Disorder: false,
    family_Any_Other_Disease: false,
    others: '',
    personal_Good_health_and_capable_of_full_work: false,
    personal_Disease_or_Injury: false,
    personal_Rejected_on_Medical_Grounds: false,
    vaccination: false,
    vaccination_status:"",
    personal_Heart_Disease: false,
    personal_Hypertension: false,
    personal_Diabetes: false,
    personal_KidneyDisease: false,
    personal_Asthma: false,
    personal_Tuberculosis: false,
    personal_Dermatitis: false,
    personal_Epilepsy: false,
    personal_Allergy: false,
    personal_Major_Operation: false,
    personal_HepatitisB: false,
    chronic_Lung_Disease: false,
    any_Other_Illness: false,
    chronic_Ear_Problem: false,
    pysical_Handicap: '',
    others_Details: '',
    height: 0,
    weight: 0,
    bmi: 0,
    bp: "",
    pulse: 0,
    spo2: 0,
    temp: 0,
    tempUnit: "C", 
    cbg: 0,
    ecg: "",
    dental_Examination: "",
    eye_Examination: "",
    diagnosis: "",
    recommendations: "",
    medication: "",
    diagnosis1: "",
    final_department: "",
    paP_SMEAR_No: 0,
    paP_SMEAR_details: "",
    scaling: "",
    filling: "",
    prostho: "",
    extraction: "",
    perio: "",
    ortho: "",
    echo: "",
    mammo: "",
    recommended: "",
    created_date: "",
    modified_date: "",
  }
  //});


  const [formData, setFormData] = useState(initialFormData);

  const handleClear = () => {
    setFormData(initialFormData);
  };


  const handleBack = () => {
    navigate(-1); 
  };



// Handles input temperature change
const handleTempChange = (e) => {
  const { name, value } = e.target;
  if (/^\d*\.?\d*$/.test(value)) {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value, 
    }));
  }
};

// Handles switching between Celsius and Fahrenheit
const handleUnitChange = (e) => {
  const { value } = e.target; 
  setFormData((prevState) => ({
    ...prevState,
    tempUnit: value, // Update unit
  }));
};

// Converts temperature based on the selected unit
const convertTemp = (value, toUnit) => {
  if (!value || isNaN(value)) return '';

  const temp = parseFloat(value);

  if (toUnit === "F") {
  
    return (temp * 9 / 5 + 32).toFixed(1); 
  } else if (toUnit === "C") {
    return ((temp - 32) * 5 / 9).toFixed(1); 
  }
  return value;
};




  useEffect(() => {
    if (location.state?.patient) {
      setFormData(location.state.patient);
    } else {
      axios
        .get(`https://www.relainstitute.in/NewHIS/api/his/getmepz/${mepz_Code}`)
        .then((res) => {
          const data = res.data;
          setFormData({
            ...data,
          });
        })
        .catch((err) => console.log("error fetching:", err));
    }
}, [mepz_Code, location.state]);

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;

    if ((name === "height" || name === "weight") && !/^\d*\.?\d*$/.test(value)) {
      return; 
    }


    setFormData((prevState) => {
      const updatedFormData = {
        ...prevState,
        [name]: type === "checkbox" ? (checked ? "Yes" : "No") : value,
      };

      if (name === "height" || name === "weight") {
        const height = updatedFormData.height;
        const weight = updatedFormData.weight;

        if (height > 0 && weight > 0) {
          const bmi = (weight / ((height * height) / 10000)).toFixed(2); // BMI calculation
          updatedFormData.bmi = bmi;
        } else {
          updatedFormData.bmi = 0; 
        }
      }

      return updatedFormData;
    });
  };

    // Function to handle vaccination checkbox change
    const handleVaccinationChange = (e) => {
      const { checked } = e.target;
  
      setFormData((prevState) => {
        let updatedFormData = {
          ...prevState,
          vaccination: checked ? "Yes" : "No", // Set to "Yes" or "No" based on the checkbox
        };
  
        // Reset vaccination status if the checkbox is unchecked
        if (!checked) {
          updatedFormData.vaccination_status = ""; // Clear vaccination status
        }
  
        return updatedFormData;
      });
    };
  
    // Function to handle vaccination status change
    const handleVaccinationStatusChange = (e) => {
      const { value } = e.target;
  
      setFormData((prevState) => ({
        ...prevState,
        vaccination_status: value, 
      }));
    };

  const navigate = useNavigate();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting form data:", formData);

    try {
      const response = await axios.post(
        `https://www.relainstitute.in/NewHIS/api/his/update_Mepz_tb`,
        formData
      );
      console.log("Response:", response);
      alert("Details Inserted successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error:", err);
      if (err.response) {
        console.error("Server responded with status:", err.response.status);
        console.error("Server response data:", err.response.data);
      }
    }
  };

  return (
    <Container>
      <h2>Patient Form</h2>

      <Form onSubmit={handleFormSubmit}>

      <Form.Group as={Row} controlId="formmepzCode">
          <Form.Label column sm={2}>
            Mepz Code
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
            
              name="mepz_Code"
              value={formData.mepz_Code || ""}
              onChange={handleInputChange}
            />
          </Col>
        </Form.Group>


        <Form.Group as={Row} controlId="formcompanyName">
          <Form.Label column sm={2}>
            Company Name
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
          
              name="company_Name"
              value={formData.company_Name || ""}
              onChange={handleInputChange}
            />
          </Col>
        </Form.Group>
        <Divider />
        <Form.Group as={Row} controlId="formName">
          <Form.Label column sm={2}>
            Name
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
           
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </Col>
        </Form.Group>
       
       
        <Form.Group as={Row} controlId="formAge">
          <Form.Label column sm={2}>
            Age
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
            
              name="age"
              value={formData.age}
              maxLength={3}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,3}$/.test(value)) {
                  setFormData((prev) => ({ ...prev, age: value }));
                }
              }}
            />
          </Col>
        </Form.Group>

  
        <Form.Group as={Row} controlId="formGender">
          <Form.Label column sm={2}>
            Gender
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              as="select"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Form.Control>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="formDob">
          <Form.Label column sm={2}>
            Date of Birth
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="formMaritalStatus">
          <Form.Label column sm={2}>
            Marital Status
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              as="select"
              name="marital_Status"
              value={formData.marital_Status}
              onChange={handleInputChange}
            >
              <option value="">Select Marital Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </Form.Control>
          </Col>
        </Form.Group>


        <Form.Group as={Row} controlId="formMobile">
          <Form.Label column sm={2}>
            Mobile
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
          
              name="mobile"
              value={formData.mobile}
              maxLength={10}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  setFormData((prev) => ({ ...prev, mobile: value }));
                }
              }}
            />
          </Col>
        </Form.Group>
       
        <hr />
        <h3>Family History (Has any of your family suffered from)</h3>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Diabetes"
            name="family_Diabetics"
            checked={formData.family_Diabetics === "Yes"}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Hypertension"
            name="family_Hypertension"
            checked={formData.family_Hypertension === "Yes"}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Heart Disease"
            name="family_Heart_Disease"
            checked={formData.family_Heart_Disease === "Yes"}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Arthritis"
            name="family_Arthritis"
            checked={formData.family_Arthritis === "Yes"}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Tuberculosis"
            name="family_Tuberculosis"
            checked={formData.family_Tuberculosis === "Yes"}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Asthma"
            name="family_Asthma"
            checked={formData.family_Asthma === "Yes"}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Cancer"
            name="family_Cancer"
            checked={formData.family_Cancer === "Yes"}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Epilepsy"
            name="family_Epilepsy"
            checked={formData.family_Epilepsy === "Yes"}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Mentaor Nervous Disorder"
            name="family_Mentaor_Nervous_Disorder"
            checked={formData.family_Mentaor_Nervous_Disorder === "Yes"}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Any Other Disease"
            name="family_Any_Other_Disease"
            checked={formData.family_Any_Other_Disease === "Yes"}
            onChange={handleInputChange}
          />
        </Form.Group>
        &nbsp;
        <Form.Group>
          <Form.Label>Others (Please Specify):</Form.Label>
          <Form.Control
            as="textarea"
            name="others"
            value={formData.others}
            onChange={handleInputChange}
          />
        </Form.Group>
        <hr />
        <h3>Personal History</h3>
        <Form.Group>
          <Form.Label>
            Are you in good health and capable of full work:
          </Form.Label>
          <Form.Control
            as="select"
            name="personal_Good_health_and_capable_of_full_work"
            value={formData.personal_Good_health_and_capable_of_full_work}
            onChange={handleInputChange}
          >
            <option value="">Select One</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>
            Have you ever suffered from an occupational disease or injury:
          </Form.Label>
          <Form.Control
            as="select"
            name="personal_Disease_or_Injury"
            value={formData.personal_Disease_or_Injury}
            onChange={handleInputChange}>
            <option value="">Select One</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>
            Have you ever been discharged or rejected on medical grounds:
          </Form.Label>
          <Form.Control
            as="select"
            name="personal_Rejected_on_Medical_Grounds"
            value={formData.personal_Rejected_on_Medical_Grounds}
            onChange={handleInputChange}>
            <option value="">Select One</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Form.Control>
        </Form.Group>
        <hr />
        <h3>Vaccination</h3>
      <Form.Group>
        <Form.Label>Have you taken any vaccination:</Form.Label>
        <Form.Check
          type="checkbox"
          label="Yes"
          name="vaccination"
          checked={formData.vaccination === "Yes"}
          onChange={handleVaccinationChange}
        />
        {formData.vaccination && (
          <Row>
            <Col xs={6} md={3}>
              <Form.Check
                type="radio"
                label="Completely"
                name="vaccination_status"
                value="completely"
                checked={formData.vaccination_status === "completely"}
                onChange={handleVaccinationStatusChange}/>
            </Col>
            <Col xs={6} md={3}>
              <Form.Check
                type="radio"
                label="Partially"
                name="vaccination_status"
                value="partially"
                checked={formData.vaccination_status === "partially"}
                onChange={handleVaccinationStatusChange}
              />
            </Col>
          </Row>
        )}
      </Form.Group>
        <hr />
        <h3>History of Specific Diseases</h3>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Heart Disease"
            name="personal_Heart_Disease"
            checked={formData.personal_Heart_Disease  === "Yes"}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Hypertension"
            name="personal_Hypertension"
            checked={formData.personal_Hypertension  === "Yes"}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Diabetes"
            name="personal_Diabetes"
            checked={formData.personal_Diabetes  === "Yes"}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="KidneyDisease"
            name="personal_KidneyDisease"
            checked={formData.personal_KidneyDisease  === "Yes"}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Asthma"
            name="personal_Asthma"
            checked={formData.personal_Asthma  === "Yes"}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Tuberculosis"
            name="personal_Tuberculosis"
            checked={formData.personal_Tuberculosis  === "Yes"}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Dermatitis"
            name="personal_Dermatitis"
            checked={formData.personal_Dermatitis  === "Yes"}
            onChange={handleInputChange}
          />
        </Form.Group>
        <div className="personal">
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Epilepsy"
              name="personal_Epilepsy"
              checked={formData.personal_Epilepsy  === "Yes"}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Allergy "
              name="personal_Allergy"
              checked={formData.personal_Allergy  === "Yes"}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Major Operation"
              name="personal_Major_Operation"
              checked={formData.personal_Major_Operation  === "Yes"}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="HepatitisB"
              name="personal_HepatitisB"
              checked={formData.personal_HepatitisB  === "Yes"}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Lung Disease"
              name="chronic_Lung_Disease"
              checked={formData.chronic_Lung_Disease  === "Yes"}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Other Illness"
              name="any_Other_Illness"
              checked={formData.any_Other_Illness  === "Yes"}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Ear Problem"
              name="chronic_Ear_Problem"
              checked={formData.chronic_Ear_Problem  === "Yes"}
              onChange={handleInputChange}
            />
          </Form.Group>
        </div>
        <hr />
        <Form.Group>
          <Form.Label>Pysically Challanged Person:</Form.Label>
          <Form.Control
            as="textarea"
            name="pysical_Handicap"
            value={formData.pysical_Handicap}
            onChange={handleInputChange}
          />
        </Form.Group>
        &nbsp;
        <Form.Group>
          <Form.Label>Other Details:</Form.Label>
          <Form.Control
            as="textarea"
            name="others_Details"
            value={formData.others_Details}
            onChange={handleInputChange}
          />
        </Form.Group>
        <hr />
        <h3>Result of Physical Examination</h3>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Height:</Form.Label>
              <Form.Control
      
                type="text"
             
                name="height"
                value={formData.height}
                maxLength={3}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Weight:</Form.Label>
              <Form.Control
                type="text"
                name="weight"
              
                value={formData.weight}
                onChange={handleInputChange}
                 maxLength={3}          
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>BMI:</Form.Label>
              <Form.Control
                type="text"
                name="bmi"
               
                value={formData.bmi}
                readOnly
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>BP:</Form.Label>
              <Form.Control
                type="text"
               
                name="bp"
                value={formData.bp}
                onChange={handleInputChange}
               
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Pulse:</Form.Label>
              <Form.Control
                type="text"
            
                name="pulse"
                maxLength={3}
                value={formData.pulse}
                onChange={(e) =>{
                  const value =e.target.value;
                  if(/^\d{0,10}$/.test(value)){
                    setFormData((prev) =>({...prev,pulse: value}))
                  }
                }}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>SpO2:</Form.Label>
              <Form.Control
                type="text"
                name="spo2"
            
                value={formData.spo2}
                maxLength={3}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,10}$/.test(value)) {
                    setFormData((prev) => ({ ...prev, spo2: value }));
                  }
                }}
              />
            </Form.Group>
          </Col>
        </Row>





        <Row>
  <Col>
    <Form.Group>
      <Form.Label>Temp:</Form.Label>
      <Form.Control
        type="text"
    
        name="temp"
        value={formData.temp}
        maxLength={5} 
        onChange={handleTempChange} 
      />
    </Form.Group>
  </Col>
</Row>

        <Col>
            <Form.Group>
              <Form.Label>ECG:</Form.Label>
              <Form.Control
                type="text"
                
                name="ecg"
                value={formData.ecg}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

        <Form.Group>
          <Form.Label>Dental Examination:</Form.Label>
          <Form.Control
            type="text"
            name="dental_Examination"
          
            value={formData.dental_Examination}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Eye Examination:</Form.Label>
          <Form.Control
            type="text"
            name="eye_Examination"
      
            value={formData.eye_Examination}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Diagnosis:</Form.Label>
          <Form.Control
            type="text"
            name="diagnosis"
            value={formData.diagnosis}
            
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Diagnosis1:</Form.Label>
          <Form.Control
            type="text"
            name="diagnosis1"
      
            value={formData.diagnosis1}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Recommendations (if any):</Form.Label>
          <Form.Control
            as="textarea"
            name="recommendations"
            value={formData.recommendations}
        
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Medication:</Form.Label>
          <Form.Control
            as="textarea"
            name="medication"
            value={formData.medication}
         
            onChange={handleInputChange}
          />
      </Form.Group>
        
      <Row  style={{position:"relative",top:'25px'}}>
          <Col sm={12} className="text-center">
          

<Button 
  variant="primary" 
  type="submit" 
  style={{ 
    padding: '10px 20px', 
    fontSize: '16px', 
    backgroundColor: '#007bff', 
    borderColor: '#007bff', 
    marginRight: '10px' 
  }}
>
  Submit
</Button>
<Button 
 onClick={handleClear} 
  variant="secondary" 
  className="ml-2" 
  style={{ 
    padding: '10px 20px', 
    fontSize: '16px', 
    backgroundColor: '#6c757d', 
    borderColor: '#6c757d', 
    marginRight: '10px' 
  }}
>
  Clear
</Button>

<Button 
  onClick={handleBack} 
  style={{ 
    padding: '10px 20px', 
    fontSize: '16px', 
    backgroundColor: '#f8f9fa', 
    borderColor: '#6c757d',
    color: '#212529', 
  }}
>
  Back 
</Button>

          </Col>
        </Row> 


      </Form>
    </Container>
  );
}
export default NewPatientForm;

import React, { useState, useContext } from 'react';
import { userContext } from './App';
import '../css/Forms.css'

function CompleteRegistration() {

    const { setUser } = useContext(userContext);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        address: {
            street: '',
            suite: '',
            city: '',
            zipcode: '',
            geo: {
                lat: '',
                lng: '',
            },
        },
        phone: '',
        website: '',
        company: {
            name: '',
            catchPhrase: '',
            bs: '',
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        const updatedFormData = { ...formData };
        const keys = name.split('.');
        const lastKey = keys.pop();

        let nestedObject = updatedFormData;
        keys.forEach((key) => {
            nestedObject = nestedObject[key];
        });

        nestedObject[lastKey] = value;

        setFormData(updatedFormData);
    };

    const handleSubmit = () => {
        fetch('http://localhost:3000/users', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((json) => {
                setUser(json);
                localStorage.setItem('currentUser', JSON.stringify(json));
            });


        alert('Registration successful');
         navigate('/home');

    }

    return (
        <div className='complete-div'>
            <h1>Continue registration</h1>
            <form className="form" onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Username:
                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Email:
                    <input type="text" name="email" value={formData.email} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Street:
                    <input type="text" name="address.street" value={formData.address.street} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Suite:
                    <input type="text" name="address.suite" value={formData.address.suite} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    City:
                    <input type="text" name="address.city" value={formData.address.city} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Zipcode:
                    <input type="text" name="address.zipcode" value={formData.address.zipcode} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Phone:
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Website:
                    <input type="text" name="website" value={formData.website} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Company Name:
                    <input type="text" name="company.name" value={formData.company.name} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Catch Phrase:
                    <input type="text" name="company.catchPhrase" value={formData.company.catchPhrase} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Business:
                    <input type="text" name="company.bs" value={formData.company.bs} onChange={handleInputChange} />
                </label>
                <br />
                <button type="submit">Complete Registration</button>
            </form>
        </div>
    )
}

export default CompleteRegistration
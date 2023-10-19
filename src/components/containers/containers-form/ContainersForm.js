import React from 'react';
import "./ContainersForm.css";

function ContainersForm() {
    return (
        <form className="container-form">
            <div className="container-form-header">
                <h1 className="container-form-header-heading">Create a Container</h1>
            </div>
            <div className="container-form-inputs">
                <label className="container-label" for="image-name">Choose Image:</label>
                <select name="image-name" id="image-name" className="container-input image-name" required>
                </select>
                <label className="container-label" for="container-name">Container Name:</label>
                <input type="text" name="container-name" id="container-name" className="container-input container-name" required/>
                <label className="container-label" for="container-password">Container Password:</label>
                <input type="password" name="container-password" id="container-password" className="container-input container-password" required/>
                <input type="submit" id="container-form-submit" className="container-submit container-form-submit"/>
            </div>
        </form>
    );
}

export default ContainersForm;

import React from 'react';

const Contact = () => {
  return (
    <div className="container-fluid pt-5">
      <div className="container">
        <div className="section-title">
          <h4 className="text-primary text-uppercase" style={{ letterSpacing: '5px' }}>
            Contact Us
          </h4>
          <h1 className="display-4">Feel Free To Contact</h1>
        </div>
        
        <div className="row px-3 pb-2">
          <div className="col-sm-4 text-center mb-3">
            <i className="fa fa-2x fa-map-marker-alt mb-3 text-primary"></i>
            <h4 className="font-weight-bold">Address</h4>
            <p>123 Street, New York, USA</p>
          </div>
          <div className="col-sm-4 text-center mb-3">
            <i className="fa fa-2x fa-phone-alt mb-3 text-primary"></i>
            <h4 className="font-weight-bold">Phone</h4>
            <p>+012 345 6789</p>
          </div>
          <div className="col-sm-4 text-center mb-3">
            <i className="far fa-2x fa-envelope mb-3 text-primary"></i>
            <h4 className="font-weight-bold">Email</h4>
            <p>info@example.com</p>
          </div>
        </div>

        <div className="row">
          {/* Columna: Google Maps */}
          <div className="col-md-6 pb-5">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.142293761144!2d-73.98731968459391!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480293%3A0x83839199a0d21340!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1634567890123!5m2!1sen!2sus" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            ></iframe>
          </div>

          {/* Columna: Formulario de Contacto */}
          <div className="col-md-6 pb-5">
            <div className="contact-form">
              <div id="success"></div>
              <form name="sentMessage" id="contactForm" noValidate="noValidate">
                <div className="control-group">
                  <input 
                    type="text" 
                    className="form-control bg-transparent p-4" 
                    id="name" 
                    placeholder="Your Name"
                    required="required" 
                  />
                  <p className="help-block text-danger"></p>
                </div>
                <div className="control-group">
                  <input 
                    type="email" 
                    className="form-control bg-transparent p-4" 
                    id="email" 
                    placeholder="Your Email"
                    required="required" 
                  />
                  <p className="help-block text-danger"></p>
                </div>
                <div className="control-group">
                  <input 
                    type="text" 
                    className="form-control bg-transparent p-4" 
                    id="subject" 
                    placeholder="Subject"
                    required="required" 
                  />
                  <p className="help-block text-danger"></p>
                </div>
                <div className="control-group">
                  <textarea 
                    className="form-control bg-transparent py-3 px-4" 
                    rows="5" 
                    id="message" 
                    placeholder="Message"
                    required="required"
                  ></textarea>
                  <p className="help-block text-danger"></p>
                </div>
                <div>
                  <button 
                    className="btn btn-primary font-weight-bold py-3 px-5" 
                    type="submit" 
                    id="sendMessageButton"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
import "./Contact.css";

function Contact() {
  return (
    <section id="contact" className="contact">
      <h2 className="section-title">Get In Touch</h2>
      <p className="contact-description">
        I'm currently open to new opportunities. Whether you have a question,
        a project idea, or just want to say hi — my inbox is open.
      </p>
      <a
        href="mailto:michaelpnvlljr@gmail.com"
        className="btn btn-primary contact-btn"
      >
        Say Hello
      </a>
      <div className="contact-links">
        <a href="https://github.com/michael101831" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </section>
  );
}

export default Contact;
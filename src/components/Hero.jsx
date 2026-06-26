import "./Hero.css";

function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <p className="hero-greeting">The Portfolio Of</p>
        <h1 className="hero-name">Michael Ward</h1>
        <p className="hero-tagline">
          Beginner Software Developer - Loves coding and learning new things.
        </p>
        <div className="hero-actions">
          <a href="#projects" className="btn btn-primary">See My Projects</a>
          <a href="#contact" className="btn btn-secondary">Get In Touch</a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
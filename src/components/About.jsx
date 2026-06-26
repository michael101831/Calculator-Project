import "./About.css";

const skills = ["HTML", "CSS", "JavaScript", "React", "Git", "Vite", "C#"];

function About() {
  return (
    <section id="about" className="about">
      <h2 className="section-title">About Me</h2>
      <div className="about-content">
        <div className="about-text">
          <p>
            I'm a Software developer who enjoys coding for work or
            during my free time, and I love the effort that goes into it.
            I'm always looking to improve my skill and put meaningful effort
            into My work.
          </p>
          <p>
            When off from work I spend my time gaming, as well as looking for different
            creative avenues, such as coding games in Unity, Godot, and the Unreal
            Engine.
          </p>
        </div>
        <div className="about-skills">
          <h3>What I'm Familiar With</h3>
          <ul className="skills-list">
            {skills.map((skill) => (
              <li key={skill} className="skill-tag">{skill}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default About;
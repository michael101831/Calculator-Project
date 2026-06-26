import "./ProjectCard.css";

function ProjectCard({ title, description, tags, liveUrl, githubUrl }) {
  return (
    <div className="project-card">
      <div className="project-body">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>
        <ul className="project-tags">
          {tags.map((tag) => (
            <li key={tag} className="project-tag">{tag}</li>
          ))}
        </ul>
        <div className="project-links">
          <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Live Site
          </a>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
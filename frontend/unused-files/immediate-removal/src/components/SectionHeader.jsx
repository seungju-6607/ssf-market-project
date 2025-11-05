import "./SectionHeader.css";

export default function SectionHeader({ title, description }) {
  return (
    <div className="section-header">
      <div>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      <a href="#" className="more">
        더보기
      </a>
    </div>
  );
}
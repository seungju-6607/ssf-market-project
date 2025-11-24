// src/pages/magazine/MagazineDetail.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { MAGAZINE_DATA } from "../../data/magazineData";
import "./MagazineDetail.css";

export default function MagazineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const article = useMemo(
    () => MAGAZINE_DATA.find((m) => String(m.id) === String(id)),
    [id]
  );

  const siblings = useMemo(() => {
    if (!article) return [];
    return MAGAZINE_DATA.filter(
      (m) =>
        m.id !== article.id &&
        (m.monthLabel === article.monthLabel ||
          m.brand === article.brand)
    ).slice(0, 3);
  }, [article]);

  if (!article) {
    return (
      <div className="mgd-page">
        <p className="mgd-notfound">해당 매거진을 찾을 수 없습니다.</p>
        <button className="mgd-back-btn" onClick={() => navigate("/magazine")}>
          ← 매거진 목록으로
        </button>
      </div>
    );
  }

  return (
    <div className="mgd-page">
      <div className="mgd-top">
        <button className="mgd-back-btn" onClick={() => navigate(-1)}>
          ← 목록으로
        </button>

        <div className="mgd-meta-row">
          <span className="mgd-pill">{article.monthLabel}</span>
          <span className="mgd-pill mgd-pill-outline">{article.brand}</span>
          <span className="mgd-pill mgd-pill-outline">{article.category}</span>
        </div>

        <h1 className="mgd-title">{article.title}</h1>
        <p className="mgd-desc">{article.description}</p>
      </div>

      <div className="mgd-hero">
        <img src={article.thumbnail} alt={article.title} />
      </div>

      <div className="mgd-content">
        {(article.content && article.content.length > 0 ? article.content : [
          "이 매거진은 아직 더미 데이터 상태입니다. 실제 프로젝트에서는 여기 부분에 스타일링 팁, 브랜드 스토리, 인터뷰 내용 등 상세 문구를 넣어주세요.",
        ]).map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      {article.tags && article.tags.length > 0 && (
        <div className="mgd-tags">
          {article.tags.map((t) => (
            <span key={t} className="mgd-tag">
              #{t}
            </span>
          ))}
        </div>
      )}

      {siblings.length > 0 && (
        <div className="mgd-related">
          <h2 className="mgd-related-title">RELATED MAGAZINE</h2>
          <div className="mgd-related-grid">
            {siblings.map((m) => (
              <Link
                key={m.id}
                to={`/magazine/${m.id}`}
                className="mgd-related-card"
              >
                <div className="mgd-related-thumb">
                  <img src={m.thumbnail} alt={m.title} />
                </div>
                <div className="mgd-related-body">
                  <span className="mgd-related-brand">{m.brand}</span>
                  <h3 className="mgd-related-ctitle">{m.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

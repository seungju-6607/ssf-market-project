import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./BrandsAll.css";

/** 단색 더미 로고 (나중에 진짜 로고 URL로 교체하면 끝) */
const logo = (text) =>
  `https://dummyimage.com/640x320/f7f7f7/111111.png&text=${encodeURIComponent(
    text
  )}`;

const BRANDS = [
  // ── 1페이지 (12)
  { name: "8SECONDS",  label: "에잇세컨즈", to: "/brand/8seconds",      logo: logo("8SECONDS") },
  { name: "BEANPOLE",  label: "빈폴",       to: "/brand/beanpole",      logo: logo("BEANPOLE") },
  { name: "BEAKER",    label: "비이커",     to: "/brand/beaker",        logo: logo("BEAKER") },
  { name: "KUHO",      label: "구호",       to: "/brand/kuho",          logo: logo("KUHO") },
  { name: "ISSEY MIYAKE", label: "이세이미야케", to: "/brand/issey-miyake", logo: logo("ISSEY MIYAKE") },
  { name: "MAISON KITSUNE", label: "메종키츠네", to: "/brand/maison-kitsune", logo: logo("MAISON KITSUNE") },
  { name: "THEORY",    label: "띠어리",     to: "/brand/theory",        logo: logo("THEORY") },
  { name: "KUHO PLUS", label: "구호플러스", to: "/brand/kuho-plus",      logo: logo("KUHO PLUS") },
  { name: "COMME des GARÇONS", label: "꼼데가르송", to: "/brand/comme-des-garcons", logo: logo("COMME des GARÇONS") },
  { name: "PATAGONIA", label: "파타고니아", to: "/brand/patagonia",     logo: logo("PATAGONIA") },
  { name: "SPORTY & RICH", label: "스포티앤리치", to: "/brand/sporty-rich", logo: logo("SPORTY&RICH") },
  { name: "S I E",     label: "시에",       to: "/brand/sie",           logo: logo("S I E") },

  // ── 2페이지 (12)
  { name: "ANEW GOLF", label: "아뉴골프",   to: "/brand/inu-golf",      logo: logo("ANEW GOLF") },
  { name: "GENERAL IDEA", label: "제너럴 아이디어", to: "/brand/general-idea", logo: logo("GENERAL IDEA") },
  { name: "LE MOUTON", label: "르무통",     to: "/brand/le-mouton",      logo: logo("LE MOUTON") },
  { name: "AMI",       label: "아미",       to: "/brand/ami",           logo: logo("AMI") },
  { name: "JUUN.J",    label: "준지",       to: "/brand/juun-j",         logo: logo("JUUN.J") },
  { name: "APERTURE",  label: "로가디스",     to: "/brand/rogadis",      logo: logo("rogaids") },
  { name: "DANTON",    label: "단톤",       to: "/brand/danton",        logo: logo("DANTON") },
  { name: "10 CORSO COMO", label: "텐꼬르소꼬모", to: "/brand/10-corso-como",   logo: logo("10 CORSO COMO") },
  { name: "COS",       label: "코스",       to: "/brand/cos",           logo: logo("COS") },
  { name: "SAINT JAMES", label: "세인트제임스", to: "/brand/saint-james", logo: logo("SAINT JAMES") },
  { name: "TOMMY HILFIGER", label: "타미힐피거", to: "/brand/tommy-hilfiger", logo: logo("TOMMY HILFIGER") },
  { name: "DIAPTER",   label: "APERTURE",   to: "/brand/diapter",       logo: logo("DIAPTER") },

  // ── 3페이지 (12)
  { name: "CANADA GOOSE", label: "캐나다구스", to: "/brand/canada-goose", logo: logo("CANADA GOOSE") },
  { name: "HERA",      label: "헤라",       to: "/brand/hera",          logo: logo("HERA") },
  { name: "GLXY",      label: "갤럭시라이프스타일", to: "/brand/galaxy-lifestyle", logo: logo("GLXY") },
  { name: "LEBEIGE",   label: "르베이지",   to: "/brand/rebaige",       logo: logo("LEBEIGE") },
  { name: "TORY BURCH",label: "토리버치",   to: "/brand/toryburch",     logo: logo("TORY BURCH") },
  { name: "GALXAY",    label: "갤럭시",     to: "/brand/galaxy",        logo: logo("GALAXY")},
  { name: "LEMAIRE",   label: "르메르",     to: "/brand/lemaire",       logo: logo("LEMAIRE") },
  { name: "FITFLOP",   label: "핏플랍",     to: "/brand/fitflop",       logo: logo("FITFLOP") },
  { name: "GANNI",     label: "가니",       to: "/brand/ganni",         logo: logo("GANNI") },
  { name: "rag & bone",label: "랙앤본",     to: "/brand/rag-bone",      logo: logo("rag & bone") },
  { name: "SAND SOUND",label: "샌드사운드", to: "/brand/sandsound",     logo: logo("SAND SOUND") },
];

const PER_PAGE = 12;

export default function BrandsAll() {
  const [page, setPage] = useState(1);

  const total = BRANDS.length;
  const totalPages = Math.ceil(total / PER_PAGE);

  const items = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return BRANDS.slice(start, start + PER_PAGE);
  }, [page]);

  const prev = () => setPage((p) => (p > 1 ? p - 1 : p));
  const next = () => setPage((p) => (p < totalPages ? p + 1 : p));

  return (
    <div className="brands-all">
      <h2 className="ba-title">인기 브랜드</h2>

      <div className="ba-grid">
        {items.map((b) => (
          <Link key={b.name} to={b.to} className="ba-card" title={b.name}>
            <div className="ba-logo">
              <img src={b.logo} alt={b.name} />
            </div>
            <div className="ba-label">{b.label}</div>
          </Link>
        ))}
      </div>

      <div className="ba-pager">
        <button className="nav" aria-label="이전" onClick={prev} disabled={page === 1}>
          ‹
        </button>
        <span className="info">
          {page} / {totalPages}
        </span>
        <button className="nav" aria-label="다음" onClick={next} disabled={page === totalPages}>
          ›
        </button>
      </div>
    </div>
  );
}

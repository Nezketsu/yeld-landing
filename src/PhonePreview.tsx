import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownUp,
  BatteryFull,
  Bell,
  CalendarSync,
  ChevronRight,
  Droplets,
  Gift,
  History,
  House,
  Landmark,
  LayoutGrid,
  LockKeyhole,
  Plus,
  Rocket,
  ShieldCheck,
  Signal,
  UserRound,
  Wifi,
} from "lucide-react";
import "./phone.css";

export type PreviewScreen = "home" | "market" | "profile";
export function PhonePreview({ screen }: { screen: PreviewScreen }) {
  return screen === "home" ? (
    <HomeScreen />
  ) : screen === "market" ? (
    <MarketScreen />
  ) : (
    <ProfileScreen />
  );
}

function PhoneChrome({
  children,
  active,
}: {
  children: React.ReactNode;
  active: "home" | "market" | "profile";
}) {
  return (
    <div className="phone-chrome">
      <div className="phone-island" />
      <div className="phone-status">
        <strong>9:41</strong>
        <span className="phone-status-icons"><Signal size={11} /><Wifi size={10} /><BatteryFull size={15} /></span>
      </div>
      {children}
      <div className="phone-nav">
        <span className={active === "home" ? "active" : ""}>
          <House size={15} />
          Accueil
        </span>
        <span className={active === "market" ? "active" : ""}>
          <LayoutGrid size={15} />
          Stratégies
        </span>
        <span>
          <Gift size={15} />
          Gains
        </span>
        <span className={active === "profile" ? "active" : ""}>
          <UserRound size={15} />
          Profil
        </span>
      </div>
      <div className="home-indicator" />
    </div>
  );
}

function HomeScreen() {
  return (
    <PhoneChrome active="home">
      <div className="phone-head">
        <b>Y.</b>
        <span className="bell-icon">
          <Bell size={14} />
        </span>
      </div>
      <div className="home-value-label">Solde total</div>
      <div className="home-value">
        <sup>$</sup>12 980
      </div>
      <div className="home-earned">
        a rapporté <b>+ $64,10</b> ce mois.
      </div>
      <div className="home-chart">
        <svg
          viewBox="0 0 240 116"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M1 105 L198 99 L219 20 L239 19"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <circle cx="239" cy="19" r="3.2" fill="currentColor" />
        </svg>
      </div>
      <div className="period-row">
        <span>7j</span>
        <span className="selected">1M</span>
        <span>3M</span>
        <span>1A</span>
        <small>6,2 % / an</small>
      </div>
      <div className="phone-action-row">
        <span>
          Déposer <Plus size={14} />
        </span>
        <span>
          Retirer <ArrowUpRight size={14} />
        </span>
      </div>
      <div className="phone-notice">
        <strong>$500,00 disponibles</strong>
        <small>Un montant disponible pour votre prochaine stratégie.</small>
        <ChevronRight size={14} />
      </div>
      <div className="phone-notice dark">
        <strong>+ $39,62 de gains disponibles</strong>
        <small>Retirez-les ou réinvestissez-les.</small>
        <ArrowRight size={14} />
      </div>
    </PhoneChrome>
  );
}

function MarketScreen() {
  const strategies = [
    {
      name: "Yeld 3",
      type: "RENDEMENT · DYNAMIQUE",
      rate: "11,2",
      color: "#ff664d",
      icon: Rocket,
    },
    { name: "Yeld 2", type: "RENDEMENT · ÉQUILIBRÉ", rate: "7,5", color: "#7057ee", icon: Landmark },
    {
      name: "Yeld Flexible",
      type: "RENDEMENT · ÉQUILIBRÉ",
      rate: "6,1",
      color: "#26a8bd",
      icon: Droplets,
    },
    { name: "Yeld 1", type: "RENDEMENT · PRUDENT", rate: "4,8", color: "#386ce9", icon: ShieldCheck },
  ];
  return (
    <PhoneChrome active="market">
      <div className="market-screen-head">
        <b>Stratégies</b>
        <span><ArrowDownUp size={10} /> Comparer</span>
      </div>
      <p className="market-screen-sub">
        Comparez l’essentiel : rendement estimé, risque et conditions de retrait.
      </p>
      <div className="market-filters">
        <b>Tout</b>
        <span>Prudent</span>
        <span>Équilibré</span>
        <span>Dynamique</span>
      </div>
      <div className="market-split">
        <span>4 STRATÉGIES</span>
        <span>TRIER · RENDEMENT ↓</span>
      </div>
      <div className="strategy-feature">
        <span
          className="strategy-icon"
          style={{ background: strategies[0]!.color }}
        >
          <Rocket size={13} />
        </span>
        <strong>Yeld 3</strong>
        <small>RENDEMENT · DYNAMIQUE</small>
        <div>
          11,2<span>%</span>
        </div>
        <p>
          Un potentiel de rendement supérieur, avec un niveau de risque plus
          élevé.
        </p>
      </div>
      <div className="strategy-list">
        {strategies.slice(1).map((item) => (
          <div className="strategy-row" key={item.name}>
            <span className="strategy-icon" style={{ background: item.color }}>
              <item.icon size={13} />
            </span>
            <span>
              <strong>{item.name}</strong>
              <small>{item.type}</small>
            </span>
            <b>
              {item.rate}
              <i>%</i>
            </b>
          </div>
        ))}
      </div>
    </PhoneChrome>
  );
}

function ProfileScreen() {
  return (
    <PhoneChrome active="profile">
      <div className="profile-heading">Claire Martin</div>
      <div className="profile-verified">
        <ShieldCheck size={11} /> Identité vérifiée · claire.martin@gmail.com
      </div>
      <div className="profile-stats">
        <span>
          <small>INVESTI</small>
          <b>$12 480</b>
        </span>
        <span>
          <small>GAINS</small>
          <b>+ $413</b>
        </span>
        <span>
          <small>DEPUIS</small>
          <b>Oct. 25</b>
        </span>
      </div>
      <div className="profile-group">COMPTE</div>
      <div className="profile-row">
        <span><UserRound size={14} /></span>
        <div>
          <strong>Informations personnelles</strong>
          <small>Nom, e-mail, téléphone, adresse</small>
        </div>
        <ChevronRight size={12} />
      </div>
      <div className="profile-row">
        <span><LockKeyhole size={14} /></span>
        <div>
          <strong>Sécurité</strong>
          <small>Face ID, code, appareils connectés</small>
        </div>
        <ChevronRight size={12} />
      </div>
      <div className="profile-row">
        <span><Landmark size={14} /></span>
        <div>
          <strong>Moyens de paiement</strong>
          <small>Apple Pay</small>
        </div>
        <ChevronRight size={12} />
      </div>
      <div className="profile-group">ÉPARGNE</div>
      <div className="profile-row">
        <span><CalendarSync size={14} /></span>
        <div>
          <strong>Investissement automatique</strong>
          <small>Désactivé</small>
        </div>
        <ChevronRight size={12} />
      </div>
      <div className="profile-row">
        <span><History size={14} /></span>
        <div>
          <strong>Historique</strong>
          <small>Tous vos mouvements</small>
        </div>
        <ChevronRight size={12} />
      </div>
    </PhoneChrome>
  );
}

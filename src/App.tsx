import {
  type FormEvent,
  type MouseEvent,
  type Ref,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronRight,
  Fingerprint,
  LayoutGrid,
  Smartphone,
  Wallet,
  X,
} from "lucide-react";
import { PhonePreview, type PreviewScreen } from "./PhonePreview";
import { RevealHeading, RevealText } from "./TextReveal";
import "./styles.css";

const views: {
  id: PreviewScreen;
  label: string;
  number: string;
  title: string;
  description: string;
  cta: string;
}[] = [
  {
    id: "home",
    label: "Votre portefeuille",
    number: "01",
    title: "Suivez.\nSans chercher.",
    description:
      "Votre solde, les montants investis et vos gains sont réunis dans une vue simple.",
    cta: "Suivre mon portefeuille",
  },
  {
    id: "market",
    label: "Les stratégies",
    number: "02",
    title: "Choisissez.\nSans jargon.",
    description:
      "Comparez chaque stratégie selon son rendement estimé, son niveau de risque et ses conditions de retrait.",
    cta: "Découvrir les stratégies",
  },
  {
    id: "profile",
    label: "Votre espace",
    number: "03",
    title: "Gardez.\nLe contrôle.",
    description:
      "Créez votre compte avec votre e-mail, sécurisez vos accès et suivez chaque mouvement.",
    cta: "Réserver ma place",
  },
];

function Logo() {
  return (
    <a className="brand" href="#accueil" aria-label="Yeld, accueil">
      Y.
    </a>
  );
}

function StaticPhone({ screen }: { screen: PreviewScreen }) {
  return (
    <div className="device">
      <div className="device-button device-button-one" />
      <div className="device-button device-button-two" />
      <div className="device-screen">
        <PhonePreview screen={screen} />
      </div>
    </div>
  );
}

type WaitlistStatus = "idle" | "submitting" | "success" | "error";

function WaitlistForm({
  idPrefix,
  email,
  status,
  message,
  inputRef,
  onEmailChange,
  onSubmit,
}: {
  idPrefix: string;
  email: string;
  status: WaitlistStatus;
  message: string;
  inputRef?: Ref<HTMLInputElement>;
  onEmailChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const emailId = `${idPrefix}-email`;
  const feedbackId = `${idPrefix}-feedback`;
  const submitting = status === "submitting";

  return (
    <div className="waitlist-block" data-status={status}>
      <form className="waitlist-form" onSubmit={onSubmit} noValidate>
        <label className="waitlist-label" htmlFor={emailId}>Adresse e-mail</label>
        <div className="waitlist-row">
          <div className="waitlist-field">
            <input
              ref={inputRef}
              id={emailId}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="vous@exemple.fr"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              aria-describedby={feedbackId}
              aria-invalid={status === "error"}
              required
              disabled={submitting}
            />
            <span className="waitlist-line" aria-hidden="true" />
          </div>
          <button type="submit" className={status === "success" ? "waitlist-submit is-success" : "waitlist-submit"} disabled={submitting}>
            <span className="waitlist-submit-label">
              {submitting ? "Inscription…" : "S’inscrire"} <ArrowUpRight size={16} aria-hidden="true" />
            </span>
            <span className="waitlist-submit-check" aria-hidden="true"><Check size={20} strokeWidth={2.5} /></span>
          </button>
        </div>
        <input className="form-honeypot" name="company" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      </form>
      <p id={feedbackId} className={`waitlist-status ${status}`} role="status" aria-live="polite">{message}</p>
    </div>
  );
}

export function App() {
  const [activeView, setActiveView] = useState<PreviewScreen>("home");
  const [phoneScale, setPhoneScale] = useState(1);
  const [email, setEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<WaitlistStatus>("idle");
  const [waitlistMessage, setWaitlistMessage] = useState("");
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const previewRef = useRef<HTMLElement>(null);
  const phoneStageRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLElement>(null);
  const modalInputRef = useRef<HTMLInputElement | null>(null);
  const closingRef = useRef<HTMLElement>(null);
  const inlineInputRef = useRef<HTMLInputElement | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: pageScroll } = useScroll();
  const { scrollYProgress } = useScroll({
    target: previewRef,
    offset: ["start start", "end end"],
  });
  const phoneY = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [26, -8, 14, -18]);
  const phoneRotate = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [-4, 1.5, -1, 3]);
  const phoneRotateY = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [-7, 4, -3, 6]);
  const phoneDepthScale = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0.95, 1.015, 0.985, 1.025]);
  // Capital uses the global document progress: the copy recedes while the
  // product is carried down into the next section. The overlap below then
  // hides it, instead of the content abruptly leaving through the top.
  const heroCopyScale = useTransform(pageScroll, [0, 0.3], [1, 0]);
  const heroProductY = useTransform(pageScroll, [0, 0.2, 0.3], ["0%", "20%", "100%"]);
  const current = views.find((view) => view.id === activeView)!;

  useEffect(() => {
    const stage = phoneStageRef.current;
    if (!stage) return;

    const fitPhone = () => {
      const { width, height } = stage.getBoundingClientRect();
      // Allow room for the frame, rotation, and the caption below the phone.
      const verticalSpace = height < 450 ? 32 : 52;
      setPhoneScale(Math.max(0.1, Math.min(1, (width - 36) / 318, (height - verticalSpace) / 626)));
    };

    fitPhone();
    const observer = new ResizeObserver(fitPhone);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!waitlistOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => modalInputRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setWaitlistOpen(false);
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      ));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [waitlistOpen]);

  useEffect(() => {
    if (!waitlistOpen || waitlistStatus !== "success") return;
    // Leave the check visible for a moment before closing the modal.
    const timeout = window.setTimeout(() => setWaitlistOpen(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [waitlistOpen, waitlistStatus]);

  useEffect(() => {
    if (waitlistStatus !== "success") return;
    const timeout = window.setTimeout(() => {
      setWaitlistStatus("idle");
      setWaitlistMessage("");
    }, 4000);
    return () => window.clearTimeout(timeout);
  }, [waitlistStatus]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (reduced) return;
    const index = Math.max(0, Math.min(views.length - 1, Math.floor(progress * views.length)));
    const nextView = views[index];
    if (nextView) setActiveView(nextView.id);
  });

  function selectView(index: number) {
    const view = views[index];
    const section = previewRef.current;
    if (!view || !section) return;
    if (reduced) {
      setActiveView(view.id);
      return;
    }
    const surface = section.querySelector<HTMLElement>(".preview-surface");
    const travel = section.offsetHeight - (surface?.offsetHeight ?? window.innerHeight);
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + travel * ((index + 0.5) / views.length),
      behavior: "smooth",
    });
  }

  function openWaitlist(event: MouseEvent<HTMLButtonElement>) {
    // The inline form is already on screen: use it instead of stacking the same form in a modal.
    const closing = closingRef.current;
    const inlineInput = inlineInputRef.current;
    if (closing && inlineInput) {
      const { top, bottom } = closing.getBoundingClientRect();
      if (top < window.innerHeight && bottom > 0) {
        inlineInput.focus({ preventScroll: true });
        inlineInput.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
        return;
      }
    }

    lastTriggerRef.current = event.currentTarget;
    if (waitlistStatus === "success") {
      setWaitlistStatus("idle");
      setWaitlistMessage("");
    }
    setWaitlistOpen(true);
  }

  function updateEmail(value: string) {
    setEmail(value);
    if (waitlistStatus !== "submitting") {
      setWaitlistStatus("idle");
      setWaitlistMessage("");
    }
  }

  async function joinWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    setWaitlistStatus("submitting");
    setWaitlistMessage("");

    try {
      let alreadyRegistered = false;
      // Bots fill the hidden field: pretend it worked without storing anything.
      if (!String(formData.get("company") ?? "").trim()) {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/waitlist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });
        alreadyRegistered = response.status === 409;
        if (!response.ok && !alreadyRegistered) throw new Error(`Waitlist insert failed: ${response.status}`);
      }

      setEmail("");
      setWaitlistStatus("success");
      setWaitlistMessage(alreadyRegistered
        ? "Cette adresse est déjà inscrite. Nous vous tiendrons au courant de la suite."
        : "Merci, votre inscription est confirmée. Nous vous tiendrons au courant de la suite.");
    } catch {
      setWaitlistStatus("error");
      setWaitlistMessage("L’inscription n’a pas pu aboutir. Réessayez dans un instant.");
    }
  }

  return (
    <div className="site" id="accueil">
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <header className="header">
        <div className="header-inner">
          <Logo />
          <nav className="navigation" aria-label="Navigation principale">
            <a href="#apercu"><Smartphone size={16} /><span>L’application</span></a>
            <a href="#approche"><LayoutGrid size={16} /><span>L’approche</span></a>
          </nav>
          <button className="header-cta" type="button" onClick={openWaitlist} aria-haspopup="dialog" aria-controls="waitlist-dialog" aria-expanded={waitlistOpen}>
            Accès anticipé <ArrowUpRight size={16} />
          </button>
        </div>
      </header>

      <main id="contenu">
        <section className="hero-transition">
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-scene">
              <div className="hero-top-brand"><Logo /></div>
              <motion.div className="hero-copy" style={reduced ? undefined : { scale: heroCopyScale }}>
                <RevealText as="span" className="eyebrow hero-eyebrow" immediate delay={0.05}>
                  <span className="small-mark" /> LE RENDEMENT CRYPTO, SANS LA COMPLEXITÉ.
                </RevealText>
                <RevealHeading as="h1" id="hero-title" lines={["Investissez.", "Yeld simplifie."]} immediate delay={0.14} />
                <RevealText immediate delay={0.42}>Accédez à des stratégies de rendement crypto depuis une expérience simple.<br />Vous choisissez. Yeld s’occupe des étapes techniques.</RevealText>
                <motion.button
                  className="hero-link"
                  type="button"
                  onClick={openWaitlist}
                  aria-haspopup="dialog"
                  aria-controls="waitlist-dialog"
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                >Rejoindre la bêta <ArrowUpRight size={15} /></motion.button>
              </motion.div>
              <div className="hero-product" role="img" aria-label="Les écrans Solde, Stratégies et Profil de l’application Yeld">
                <motion.div className="hero-phones-motion" style={reduced ? undefined : { y: heroProductY }}>
                  <div className="hero-phones" aria-hidden="true">
                    <div className="hero-phone hero-phone-left"><StaticPhone screen="market" /></div>
                    <div className="hero-phone hero-phone-center"><StaticPhone screen="home" /></div>
                    <div className="hero-phone hero-phone-right"><StaticPhone screen="profile" /></div>
                  </div>
                </motion.div>
              </div>
              <span className="hero-caption">Des stratégies complexes. Une expérience simple.</span>
            </div>
          </section>
        </section>

        <section className="statement-transition">
          <section className="statement" aria-labelledby="statement-title">
            <div className="statement-content">
              <div className="statement-heading">
                <RevealText as="span" className="eyebrow">UN PONT VERS DE NOUVEAUX RENDEMENTS</RevealText>
                <RevealHeading id="statement-title" lines={["Vous choisissez.", "Yeld orchestre."]} delay={0.08} />
              </div>
              <RevealText delay={0.24}>Alimentez votre compte, comparez les stratégies et investissez. Yeld réalise automatiquement les opérations nécessaires jusqu’à la stratégie choisie.</RevealText>
            </div>
          </section>
        </section>

        <section className="preview" id="apercu" ref={previewRef} aria-label="Découvrir l’interface Yeld">
          <div className="preview-surface">
            <div className="preview-topline"><span>L’APPLICATION YELD</span><span>INVESTIR SANS SE PERDRE.</span></div>
            <div className="preview-layout">
              <div className="device-position" ref={phoneStageRef}>
                <div className="device-fit" style={{ transform: `translate(-50%, -50%) scale(${phoneScale})` }}>
                <motion.div className="device" style={reduced ? undefined : { y: phoneY, rotate: phoneRotate, rotateY: phoneRotateY, scale: phoneDepthScale, transformPerspective: 1200 }}>
                  <div className="device-button device-button-one" />
                  <div className="device-button device-button-two" />
                  <div className="device-screen" aria-label={"Aperçu : " + current.label}>
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={activeView}
                        className="screen-layer"
                        initial={{ opacity: 0, y: reduced ? 0 : 48, scale: reduced ? 1 : 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: reduced ? 0 : -36, scale: reduced ? 1 : 1.025 }}
                        transition={{ duration: reduced ? 0 : 0.52, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <PhonePreview screen={activeView} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
                </div>
                <span className="device-caption">Aperçu illustratif</span>
              </div>
              <div className="preview-details">
                <div className="preview-copy" aria-live="polite">
                  {/* Invisible copies of every view keep the block at the tallest text's height, so the switcher never moves. */}
                  {views.map((view) => (
                    <div key={view.id} className="preview-copy-sizer" aria-hidden="true">
                      <span className="preview-number">{view.number} / 03</span>
                      <h2>{view.title.split("\n").map((line) => <span key={line} className="reveal-line"><span className="reveal-line-content">{line}</span></span>)}</h2>
                      <p>{view.description}</p>
                    </div>
                  ))}
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeView}
                      initial={reduced ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.22 }}
                    >
                      <span className="preview-number">{current.number} / 03</span>
                      <RevealHeading lines={current.title.split("\n")} mutedLine={-1} immediate duration={0.6} />
                      <RevealText immediate delay={0.12}>{current.description}</RevealText>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="preview-switcher" role="group" aria-label="Choisir un écran de l’application">
                  {views.map((view, index) => (
                    <button type="button" key={view.id} aria-pressed={view.id === activeView} onClick={() => selectView(index)} className={view.id === activeView ? "view-button active" : "view-button"}>
                      <span>{view.number}</span>{view.label}<ChevronRight size={14} />
                    </button>
                  ))}
                </div>
                <button className="preview-cta" type="button" onClick={openWaitlist} aria-haspopup="dialog" aria-controls="waitlist-dialog">
                  <span className="preview-cta-label">
                    {views.map((view) => <span key={view.id} className="preview-cta-sizer" aria-hidden="true">{view.cta}</span>)}
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={activeView}
                        initial={reduced ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: reduced ? 0 : 0.18 }}
                      >{current.cta}</motion.span>
                    </AnimatePresence>
                  </span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="preview-bottomline"><ArrowDown size={12} /><span>{reduced ? "Choisissez un écran pour explorer" : "Faites défiler pour explorer"}</span></div>
            {!reduced && <div className="preview-progress" aria-hidden="true"><motion.div style={{ scaleX: scrollYProgress }} /></div>}
          </div>
        </section>

        <section className="approach" id="approche" aria-labelledby="approach-title">
          <div className="approach-heading">
            <RevealText as="span" className="eyebrow">COMMENT ÇA MARCHE</RevealText>
            <RevealHeading id="approach-title" lines={["Trois étapes.", "Rien de plus."]} delay={0.08} />
          </div>
          <div className="principles">
            {[
              { icon: Fingerprint, title: "Créez votre compte.", description: "Votre e-mail suffit. Yeld crée un portefeuille dont vous gardez le contrôle." },
              { icon: LayoutGrid, title: "Choisissez une stratégie.", description: "Comparez le rendement estimé, le niveau de risque et les conditions de retrait avant d’investir." },
              { icon: Wallet, title: "Investissez en quelques clics.", description: "Yeld exécute les étapes techniques pour placer vos fonds dans la stratégie choisie." },
            ].map(({ icon: Icon, title, description }, index) => (
              <motion.article key={title} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5, delay: reduced ? 0 : index * 0.08 }}>
                <span className="principle-icon"><Icon size={23} strokeWidth={1.5} /></span>
                <div><h3>{title}</h3><p>{description}</p></div>
                <span className="principle-number">0{index + 1}</span>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="closing" id="beta" ref={closingRef} aria-label="Accès anticipé à Yeld">
          <RevealText as="span" className="eyebrow">ACCÈS ANTICIPÉ</RevealText>
          <RevealHeading lines={["Soyez parmi", "les premiers."]} delay={0.1} />
          <RevealText className="beta-copy" delay={0.2}>Laissez votre e-mail pour suivre le développement et recevoir votre invitation dès l’ouverture de la bêta.</RevealText>
          <WaitlistForm
            idPrefix="footer-waitlist"
            email={email}
            status={waitlistStatus}
            message={waitlistMessage}
            inputRef={inlineInputRef}
            onEmailChange={updateEmail}
            onSubmit={joinWaitlist}
          />
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main"><Logo /><span>L’investissement crypto, rendu accessible.</span><a href="#accueil">Retour en haut <ArrowUpRight size={14} /></a></div>
        <div className="footer-fineprint"><span>© {new Date().getFullYear()} Yeld</span><p>Yeld est en cours de développement. Les chiffres présentés sont illustratifs. Investir dans des crypto-actifs comporte un risque de perte partielle ou totale du capital. Les rendements sont variables et non garantis. La disponibilité des fonds dépend de chaque stratégie.</p></div>
      </footer>

      <AnimatePresence onExitComplete={() => lastTriggerRef.current?.focus()}>
        {waitlistOpen && (
          <motion.div
            className="waitlist-modal-backdrop"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.22 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setWaitlistOpen(false);
            }}
          >
            <motion.section
              ref={modalRef}
              id="waitlist-dialog"
              className="waitlist-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="waitlist-dialog-title"
              initial={reduced ? false : { opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: reduced ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="waitlist-modal-topline">
                <span className="brand" aria-hidden="true">Y.</span>
                <button className="waitlist-modal-close" type="button" onClick={() => setWaitlistOpen(false)} aria-label="Fermer le formulaire">
                  <X size={17} />
                </button>
              </div>
              <div className="waitlist-modal-content">
                <span className="eyebrow"><span className="small-mark" /> INSCRIPTION</span>
                <h2 id="waitlist-dialog-title">Soyez parmi<br /><span className="is-muted">les premiers.</span></h2>
                <p>Laissez votre e-mail, on vous tient au courant.</p>
                <WaitlistForm
                  idPrefix="modal-waitlist"
                  email={email}
                  status={waitlistStatus}
                  message={waitlistMessage}
                  inputRef={modalInputRef}
                  onEmailChange={updateEmail}
                  onSubmit={joinWaitlist}
                />
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

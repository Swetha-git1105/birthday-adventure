import { Component } from "react";
import GameButton from "./GameButton.jsx";

export default class ErrorBoundary extends Component {
  /** @param {object} props */
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-deep)",
            gap: 20,
            padding: 40,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 48 }}>⚠️</div>
          <h2 style={{ color: "var(--accent-pink)", fontSize: 22 }}>
            Oops! Something went wrong
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 380, lineHeight: 1.5 }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <GameButton
            onClick={() => {
              this.setState({ hasError: false, error: null });
              this.props.onReturnToMap?.();
            }}
            variant="gold"
          >
            Return to Map
          </GameButton>
        </div>
      );
    }
    return this.props.children;
  }
}

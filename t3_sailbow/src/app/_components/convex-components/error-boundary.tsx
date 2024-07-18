"use client";
import { ConvexError, type Value } from "convex/values";
import { Component, type ErrorInfo } from "react";

interface Props {
  children: React.ReactNode;
}

interface State<TError extends Value> {
  error: ConvexError<TError> | null;
}

class ConvexErrorBoundary<TError extends Value> extends Component<
  Props,
  State<TError>
> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ConvexErrorBoundary caught an error: ", error, errorInfo);
    if (error instanceof ConvexError) {
      this.setState({ error });
    }
  }

  render() {
    return this.props.children;
  }
}

export default ConvexErrorBoundary;

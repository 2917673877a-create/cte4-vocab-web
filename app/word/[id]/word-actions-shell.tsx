"use client";

import dynamic from "next/dynamic";
import { Component, ReactNode } from "react";
import { Word } from "@/lib/types";

const LazyWordActions = dynamic(() => import("./word-actions").then((mod) => mod.WordActions), {
  ssr: false,
  loading: () => (
    <div className="mt-8 rounded-3xl border border-stone-200 bg-stone-50 p-5 text-sm text-stone-500">
      正在加载学习操作...
    </div>
  ),
});

type WordActionsShellProps = {
  word: Word;
};

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class WordActionsErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: unknown) {
    console.error("Word actions crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-800">
          学习操作暂时加载失败，但单词详情仍可正常查看。请稍后刷新页面再试。
        </div>
      );
    }

    return this.props.children;
  }
}

export function WordActionsShell({ word }: WordActionsShellProps) {
  return (
    <WordActionsErrorBoundary>
      <LazyWordActions word={word} />
    </WordActionsErrorBoundary>
  );
}

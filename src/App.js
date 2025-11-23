import React from "react";
import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PageNavigation from "./components/PageNavigation";
import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Resume from "./pages/Resume";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import ChatAI from "./pages/ChatAI";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <div className="App">
      <Router basename="/">
        <Header />
        <PageNavigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/chat" element={<ChatAI />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

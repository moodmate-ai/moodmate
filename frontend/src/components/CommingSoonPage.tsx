const ComingSoonPage: React.FC<{ title: string }> = ({ title }) => {
    return (
      <div className="coming-soon-container">
        <h1>{title}</h1>
        <p>This feature is coming soon. Stay tuned!</p>
      </div>
    );
  };

export default ComingSoonPage;
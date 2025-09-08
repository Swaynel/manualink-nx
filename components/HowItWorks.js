export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Create a Profile',
      description: 'Register as a worker or employer and complete your profile with your skills or job requirements.'
    },
    {
      number: 2,
      title: 'Find Work or Workers',
      description: 'Search for jobs across Kenya or browse available workers in your county.'
    },
    {
      number: 3,
      title: 'Connect & Agree',
      description: 'Message directly through our platform and agree on terms before starting work.'
    },
    {
      number: 4,
      title: 'Get Paid',
      description: 'Complete the job and get paid securely via M-Pesa or bank transfer.'
    }
  ];

  return (
    <section className="how-it-works" aria-labelledby="how-it-works-heading">
      <div className="container">
        <h2 id="how-it-works-heading">How ManuaLink Works</h2>
        <div className="steps">
          {steps.map(step => (
            <div key={step.number} className="step">
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
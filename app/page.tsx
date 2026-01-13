export default function Home() {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <section className="text-center py-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">SAM v6</h2>
        <p className="text-xl text-gray-700 mb-8">Automatic evaluation of handwritten student responses</p>
        <div className="space-x-4">
          <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-blue-700">Login</a>
          <a href="/dashboard" className="bg-green-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-green-700">Try Demo</a>
        </div>
      </section>
      
      <section className="grid md:grid-cols-3 gap-8 py-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-2xl font-bold mb-4">OCR Recognition</h3>
          <p className="text-gray-700">Advanced optical character recognition for handwritten responses.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-2xl font-bold mb-4">AI Feedback</h3>
          <p className="text-gray-700">Intelligent feedback based on curriculum standards.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-2xl font-bold mb-4">Real-time Evaluation</h3>
          <p className="text-gray-700">Instant evaluation and scoring of student work.</p>
        </div>
      </section>
      
      <section className="bg-blue-50 p-12 rounded-lg text-center">
        <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
        <p className="text-lg text-gray-700 mb-6">Join thousands of educators using SAM v6 to streamline student evaluation.</p>
        <a href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-lg inline-block hover:bg-blue-700 text-lg font-semibold">Start Now</a>
      </section>
    </div>
  );
}

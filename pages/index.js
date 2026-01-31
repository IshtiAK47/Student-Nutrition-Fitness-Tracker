import Head from 'next/head';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Student Nutrition & Fitness Tracker</title>
        <meta name="description" content="DBMS Project - University Nutrition Tracking System" />
      </Head>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            {/* Header with Logo */}
            <div className="text-center mb-5">
              <div className="mb-4">
                {/* University Logo */}
                <img 
                  src="https://www.cstu.ac.bd/logo/CSTU-LOGO.svg"
                  alt="University Logo" 
                  style={{ maxHeight: '120px', marginBottom: '20px' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <h1 className="display-4">Student Nutrition & Fitness Tracker</h1>
              <p className="lead text-muted">University Canteen Management System</p>
              <p className="text-secondary">DBMS Project</p>
            </div>

            {/* System Overview */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">System Overview</h5>
                <p className="card-text">
                  A comprehensive database management system for tracking student nutrition intake 
                  and fitness records in a university canteen environment.
                </p>
                <ul>
                  <li>Track daily nutrition intake (calories, protein, carbs, fat)</li>
                  <li>Monitor student health records (BMI, weight, height)</li>
                  <li>Generate nutrition analysis and recommendations</li>
                  <li>Department-wise health and nutrition statistics</li>
                </ul>
              </div>
            </div>

            {/* User Modules */}
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="bi bi-shop"></i> Canteen Module
                    </h5>
                    <p className="card-text">
                      Create invoices for students, select food items from the menu,
                      and automatically calculate nutritional totals.
                    </p>
                    <ul className="list-unstyled">
                      <li>✓ Student verification</li>
                      <li>✓ Multi-item selection</li>
                      <li>✓ Auto nutrition calculation</li>
                      <li>✓ Invoice generation</li>
                    </ul>
                    <Link href="/canteen" className="btn btn-primary">
                      Open Canteen System
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="bi bi-heart-pulse"></i> Medical/Teacher Module
                    </h5>
                    <p className="card-text">
                      View student profiles, add health records, analyze nutrition intake,
                      and generate recommendations.
                    </p>
                    <ul className="list-unstyled">
                      <li>✓ Health record management</li>
                      <li>✓ BMI calculation</li>
                      <li>✓ Nutrition analysis</li>
                      <li>✓ Deficiency detection</li>
                    </ul>
                    <Link href="/medical" className="btn btn-success">
                      Open Medical Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Database Features */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Database Features (3NF Normalization)</h5>
                <div className="row">
                  <div className="col-md-6">
                    <h6>Tables</h6>
                    <ul>
                      <li>Department, Batch, Student</li>
                      <li>FoodCategory, FoodItem</li>
                      <li>Invoice, InvoiceDetails</li>
                      <li>HealthRecord, NutritionAnalysis</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Key Features</h6>
                    <ul>
                      <li>Primary & Foreign Keys</li>
                      <li>Referential Integrity</li>
                      <li>JOIN Queries</li>
                      <li>Aggregation Functions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Technology Stack</h5>
                <div className="row">
                  <div className="col-md-4">
                    <strong>Frontend:</strong>
                    <ul>
                      <li>Next.js</li>
                      <li>React</li>
                      <li>Bootstrap 5</li>
                    </ul>
                  </div>
                  <div className="col-md-4">
                    <strong>Backend:</strong>
                    <ul>
                      <li>Next.js API Routes</li>
                      <li>RAW SQL Queries</li>
                      <li>mysql2 Library</li>
                    </ul>
                  </div>
                  <div className="col-md-4">
                    <strong>Database:</strong>
                    <ul>
                      <li>MySQL</li>
                      <li>Normalized (3NF)</li>
                      <li>Transaction Support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-5 mb-4">
              <p className="text-muted">
                <small>
                  Developed for DBMS Course | Focus: Database Design & SQL Queries
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card {
          transition: transform 0.2s;
        }
        .card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </>
  );
}

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function MedicalPage() {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [department, setDepartment] = useState('');
  const [nutritionData, setNutritionData] = useState(null);
  const [periodDays, setPeriodDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Health Record Form
  const [healthForm, setHealthForm] = useState({
    height: '',
    weight: '',
    notes: ''
  });

  const fetchNutritionData = async () => {
    if (!studentId.trim()) {
      setMessage({ type: 'danger', text: 'Please enter Student ID' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`/api/nutrition/${studentId}?period_days=${periodDays}`);
      const data = await response.json();

      if (data.success) {
        setNutritionData(data);
        setMessage({ type: 'success', text: 'Data loaded successfully!' });
      } else {
        setNutritionData(null);
        setMessage({ type: 'danger', text: data.error || 'Student not found' });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error fetching nutrition data' });
    } finally {
      setLoading(false);
    }
  };

  const addHealthRecord = async () => {
    if (!studentId.trim()) {
      setMessage({ type: 'danger', text: 'Please enter Student ID first' });
      return;
    }

    if (!healthForm.height || !healthForm.weight) {
      setMessage({ type: 'danger', text: 'Height and weight are required' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          height: parseFloat(healthForm.height),
          weight: parseFloat(healthForm.weight),
          recorded_by: 'medical',
          notes: healthForm.notes
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: `Health record added! BMI: ${data.health_record.bmi} (${data.health_record.bmi_category})` 
        });
        setHealthForm({ height: '', weight: '', notes: '' });
        
        // Refresh nutrition data
        fetchNutritionData();
      } else {
        setMessage({ type: 'danger', text: data.error || 'Failed to add health record' });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error adding health record' });
    } finally {
      setLoading(false);
    }
  };

  const saveAnalysis = async () => {
    if (!nutritionData) {
      setMessage({ type: 'danger', text: 'Please load student data first' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          period_start: nutritionData.period.period_start,
          period_end: nutritionData.period.period_end,
          avg_daily_calories: parseFloat(nutritionData.nutrition_summary.avg_daily_calories),
          avg_daily_protein: parseFloat(nutritionData.nutrition_summary.avg_daily_protein),
          avg_daily_carbs: parseFloat(nutritionData.nutrition_summary.avg_daily_carbs),
          avg_daily_fat: parseFloat(nutritionData.nutrition_summary.avg_daily_fat),
          calorie_status: nutritionData.analysis.calorie_status,
          protein_status: nutritionData.analysis.protein_status,
          advice: nutritionData.analysis.advice,
          analyzed_by: 'medical'
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Analysis saved successfully!' });
      } else {
        setMessage({ type: 'danger', text: data.error || 'Failed to save analysis' });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error saving analysis' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Medical Dashboard - Nutrition Tracker</title>
      </Head>

      <div className="container mt-4 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Medical / Teacher Dashboard</h2>
          <Link href="/" className="btn btn-secondary">
            ← Back to Home
          </Link>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`alert alert-${message.type} alert-dismissible fade show`}>
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
          </div>
        )}

        {/* Student Information */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Student Information</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Student ID *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., B220102003"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Student Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Adipta"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Department *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., ICT"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Analysis Period</label>
                <select 
                  className="form-select"
                  value={periodDays}
                  onChange={(e) => setPeriodDays(parseInt(e.target.value))}
                >
                  <option value="7">Last 7 days</option>
                  <option value="14">Last 14 days</option>
                  <option value="30">Last 30 days</option>
                </select>
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button 
                  className="btn btn-primary w-100"
                  onClick={fetchNutritionData}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load Data'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {nutritionData && (
          <>
            {/* Student Info */}
            <div className="card mb-4">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">Student Profile</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Name:</strong> {nutritionData.student.student_name}</p>
                    <p><strong>Student ID:</strong> {nutritionData.student.student_id}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Department:</strong> {nutritionData.student.department_name}</p>
                    <p><strong>Batch:</strong> {nutritionData.student.batch_number}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Record */}
            <div className="card mb-4">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Health Record</h5>
              </div>
              <div className="card-body">
                {nutritionData.latest_health ? (
                  <div className="row mb-3">
                    <div className="col-md-3">
                      <strong>Height:</strong> {nutritionData.latest_health.height} cm
                    </div>
                    <div className="col-md-3">
                      <strong>Weight:</strong> {nutritionData.latest_health.weight} kg
                    </div>
                    <div className="col-md-3">
                      <strong>BMI:</strong> {nutritionData.latest_health.bmi}
                    </div>
                    <div className="col-md-3">
                      <strong>Recorded:</strong> {new Date(nutritionData.latest_health.recorded_at).toLocaleDateString()}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted">No health record found</p>
                )}

                <hr />

                <h6>Add New Health Record</h6>
                <div className="row g-3">
                  <div className="col-md-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Height (cm)"
                      value={healthForm.height}
                      onChange={(e) => setHealthForm({...healthForm, height: e.target.value})}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Weight (kg)"
                      value={healthForm.weight}
                      onChange={(e) => setHealthForm({...healthForm, weight: e.target.value})}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Notes (optional)"
                      value={healthForm.notes}
                      onChange={(e) => setHealthForm({...healthForm, notes: e.target.value})}
                    />
                  </div>
                  <div className="col-md-2">
                    <button 
                      className="btn btn-success w-100"
                      onClick={addHealthRecord}
                      disabled={loading}
                    >
                      Add Record
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Nutrition Summary */}
            <div className="card mb-4">
              <div className="card-header bg-warning">
                <h5 className="mb-0">Nutrition Summary ({periodDays} days)</h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-3 mb-3">
                    <div className="p-3 border rounded">
                      <h3 className="mb-0">{nutritionData.nutrition_summary.avg_daily_calories}</h3>
                      <small className="text-muted">Avg Daily Calories</small>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="p-3 border rounded">
                      <h3 className="mb-0">{nutritionData.nutrition_summary.avg_daily_protein}</h3>
                      <small className="text-muted">Avg Daily Protein (g)</small>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="p-3 border rounded">
                      <h3 className="mb-0">{nutritionData.nutrition_summary.avg_daily_carbs}</h3>
                      <small className="text-muted">Avg Daily Carbs (g)</small>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="p-3 border rounded">
                      <h3 className="mb-0">{nutritionData.nutrition_summary.avg_daily_fat}</h3>
                      <small className="text-muted">Avg Daily Fat (g)</small>
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-4">
                    <p><strong>Total Invoices:</strong> {nutritionData.nutrition_summary.total_invoices}</p>
                    <p><strong>Total Spent:</strong> ৳{nutritionData.nutrition_summary.total_spent}</p>
                  </div>
                  <div className="col-md-4">
                    <p><strong>Calorie Status:</strong> 
                      <span className={`ms-2 badge bg-${nutritionData.analysis.calorie_status === 'Low' ? 'danger' : nutritionData.analysis.calorie_status === 'High' ? 'warning' : 'success'}`}>
                        {nutritionData.analysis.calorie_status}
                      </span>
                    </p>
                    <p><strong>Protein Status:</strong> 
                      <span className={`ms-2 badge bg-${nutritionData.analysis.protein_status === 'Low' ? 'danger' : nutritionData.analysis.protein_status === 'High' ? 'warning' : 'success'}`}>
                        {nutritionData.analysis.protein_status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis & Recommendations */}
            <div className="card mb-4">
              <div className="card-header bg-danger text-white">
                <h5 className="mb-0">Analysis & Recommendations</h5>
              </div>
              <div className="card-body">
                <div className="alert alert-info">
                  <h6>Professional Advice:</h6>
                  <p className="mb-0">{nutritionData.analysis.advice}</p>
                </div>

                <button 
                  className="btn btn-primary"
                  onClick={saveAnalysis}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Analysis to Database'}
                </button>
              </div>
            </div>

            {/* Recent Invoices */}
            {nutritionData.recent_invoices.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Recent Invoices</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Price</th>
                          <th>Calories</th>
                          <th>Protein</th>
                          <th>Carbs</th>
                          <th>Fat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nutritionData.recent_invoices.map(invoice => (
                          <tr key={invoice.invoice_id}>
                            <td>{new Date(invoice.created_at).toLocaleDateString()}</td>
                            <td>৳{parseFloat(invoice.total_price).toFixed(2)}</td>
                            <td>{parseFloat(invoice.total_calories).toFixed(0)}</td>
                            <td>{parseFloat(invoice.total_protein).toFixed(1)}g</td>
                            <td>{parseFloat(invoice.total_carbs).toFixed(1)}g</td>
                            <td>{parseFloat(invoice.total_fat).toFixed(1)}g</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

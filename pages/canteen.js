import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CanteenPage() {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [department, setDepartment] = useState('');
  const [foodCategories, setFoodCategories] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [createdInvoice, setCreatedInvoice] = useState(null);

  // Fetch food items on component mount
  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await fetch('/api/foods');
      const data = await response.json();
      if (data.success) {
        setFoodCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };

  const addItem = (foodItem) => {
    const existing = selectedItems.find(item => item.food_item_id === foodItem.food_item_id);
    
    if (existing) {
      setSelectedItems(selectedItems.map(item =>
        item.food_item_id === foodItem.food_item_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedItems([...selectedItems, { ...foodItem, quantity: 1 }]);
    }
  };

  const updateQuantity = (foodItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(foodItemId);
    } else {
      setSelectedItems(selectedItems.map(item =>
        item.food_item_id === foodItemId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const removeItem = (foodItemId) => {
    setSelectedItems(selectedItems.filter(item => item.food_item_id !== foodItemId));
  };

  const calculateTotals = () => {
    return selectedItems.reduce((totals, item) => ({
      price: totals.price + (item.price * item.quantity),
      calories: totals.calories + (item.calories * item.quantity),
      protein: totals.protein + (item.protein * item.quantity),
      carbs: totals.carbs + (item.carbs * item.quantity),
      fat: totals.fat + (item.fat * item.quantity)
    }), { price: 0, calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const createInvoice = async () => {
    if (!studentId.trim() || !studentName.trim() || !department.trim()) {
      setMessage({ type: 'danger', text: 'Please enter Student ID, Name, and Department' });
      return;
    }

    if (selectedItems.length === 0) {
      setMessage({ type: 'danger', text: 'Please add at least one item' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          student_name: studentName,
          department: department,
          created_by: 'canteen_staff',
          items: selectedItems.map(item => ({
            food_item_id: item.food_item_id,
            quantity: item.quantity
          }))
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: `Invoice #${data.invoice.invoice_id} created successfully!` 
        });
        // Store invoice details with purchased items
        setCreatedInvoice({
          ...data.invoice,
          student_name: studentName,
          student_id: studentId,
          department: department,
          items: [...selectedItems],
          created_at: new Date().toLocaleString()
        });
        setSelectedItems([]);
      } else {
        setMessage({ type: 'danger', text: data.error || 'Failed to create invoice' });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error creating invoice' });
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  const printInvoice = () => {
    window.print();
  };

  const resetInvoice = () => {
    setCreatedInvoice(null);
    setStudentId('');
    setStudentName('');
    setDepartment('');
    setMessage({ type: '', text: '' });
  };

  return (
    <>
      <Head>
        <title>Canteen System - Nutrition Tracker</title>
      </Head>

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Canteen Invoice System</h2>
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
            <h5 className="mb-0">Step 1: Enter Student Information</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Student ID *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., B220102003"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Student Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Adipta"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Department *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., ICT"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Food Menu */}
          <div className="col-md-7">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Step 2: Select Food Items</h5>
              </div>
              <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {foodCategories.map(category => (
                  <div key={category.category_id} className="mb-4">
                    <h6 className="border-bottom pb-2">{category.category_name}</h6>
                    <div className="row g-2">
                      {category.items.map(item => (
                        <div key={item.food_item_id} className="col-md-6">
                          <div className="card">
                            <div className="card-body p-2">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className="mb-1">{item.food_name}</h6>
                                  <small className="text-muted">
                                    ৳{item.price} | {item.calories} kcal
                                  </small>
                                </div>
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => addItem(item)}
                                  disabled={!studentId || !studentName || !department}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Items & Invoice */}
          <div className="col-md-5">
            <div className="card sticky-top" style={{ top: '20px' }}>
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">Step 3: Generate Invoice</h5>
              </div>
              <div className="card-body">
                {selectedItems.length === 0 ? (
                  <p className="text-muted text-center">No items selected</p>
                ) : (
                  <>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {selectedItems.map(item => (
                        <div key={item.food_item_id} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                          <div className="flex-grow-1">
                            <div>{item.food_name}</div>
                            <small className="text-muted">৳{item.price} × {item.quantity}</small>
                          </div>
                          <div className="d-flex align-items-center">
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              style={{ width: '60px' }}
                              value={item.quantity}
                              min="1"
                              onChange={(e) => updateQuantity(item.food_item_id, parseInt(e.target.value))}
                            />
                            <button
                              className="btn btn-sm btn-danger ms-2"
                              onClick={() => removeItem(item.food_item_id)}
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <hr />

                    <div className="mt-3">
                      <h6>Totals:</h6>
                      <table className="table table-sm">
                        <tbody>
                          <tr>
                            <td><strong>Price:</strong></td>
                            <td className="text-end">৳{totals.price.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td><strong>Calories:</strong></td>
                            <td className="text-end">{totals.calories.toFixed(2)} kcal</td>
                          </tr>
                          <tr>
                            <td><strong>Protein:</strong></td>
                            <td className="text-end">{totals.protein.toFixed(2)} g</td>
                          </tr>
                          <tr>
                            <td><strong>Carbs:</strong></td>
                            <td className="text-end">{totals.carbs.toFixed(2)} g</td>
                          </tr>
                          <tr>
                            <td><strong>Fat:</strong></td>
                            <td className="text-end">{totals.fat.toFixed(2)} g</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <button
                      className="btn btn-success w-100 mt-2"
                      onClick={createInvoice}
                      disabled={loading || !studentId || !studentName || !department || selectedItems.length === 0}
                    >
                      {loading ? 'Creating...' : 'Create Invoice'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Display Modal/Section */}
        {createdInvoice && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">Invoice Created Successfully</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={resetInvoice}></button>
                </div>
                <div className="modal-body" id="invoice-print-area">
                  {/* Invoice Header */}
                  <div className="text-center mb-4">
                    <h4>University Canteen</h4>
                    <p className="text-muted">Student Nutrition & Fitness Tracker</p>
                    <hr />
                  </div>

                  {/* Invoice Details */}
                  <div className="row mb-3">
                    <div className="col-6">
                      <p><strong>Invoice #:</strong> {createdInvoice.invoice_id}</p>
                      <p><strong>Student ID:</strong> {createdInvoice.student_id}</p>
                      <p><strong>Student Name:</strong> {createdInvoice.student_name}</p>
                    </div>
                    <div className="col-6 text-end">
                      <p><strong>Department:</strong> {createdInvoice.department}</p>
                      <p><strong>Date:</strong> {createdInvoice.created_at}</p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Item</th>
                        <th className="text-center">Qty</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Calories</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {createdInvoice.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.food_name}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">৳{item.price.toFixed(2)}</td>
                          <td className="text-end">{item.calories.toFixed(2)} kcal</td>
                          <td className="text-end">৳{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-light">
                      <tr>
                        <th colspan="4" className="text-end">Total Price:</th>
                        <th className="text-end">৳{createdInvoice.total_price.toFixed(2)}</th>
                      </tr>
                      <tr>
                        <td colspan="5" className="text-center">
                          <small>
                            <strong>Nutrition Summary:</strong> 
                            {createdInvoice.total_calories.toFixed(0)} kcal | 
                            Protein: {createdInvoice.total_protein.toFixed(1)}g | 
                            Carbs: {createdInvoice.total_carbs.toFixed(1)}g | 
                            Fat: {createdInvoice.total_fat.toFixed(1)}g
                          </small>
                        </td>
                      </tr>
                    </tfoot>
                  </table>

                  <div className="text-center mt-4">
                    <p className="text-muted"><small>Thank you for your purchase!</small></p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={printInvoice}>
                    <i className="bi bi-printer"></i> Print Invoice
                  </button>
                  <button className="btn btn-secondary" onClick={resetInvoice}>
                    Create New Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-print-area, #invoice-print-area * {
            visibility: visible;
          }
          #invoice-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .modal-footer, .btn-close {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

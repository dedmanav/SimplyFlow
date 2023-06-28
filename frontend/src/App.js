import React, { useEffect, useState } from 'react';
import { Graph } from 'react-d3-graph';
import './App.css';
import splitwise from './splitwise';

function App() {
	var [data, setData] = useState([]);
	var [payer, setPayer] = useState('');
	var [payee, setPayee] = useState('');
	var [amount, setAmount] = useState('');
	var [objId, setObjId] = useState(1);
	var [flow, setFlow] = useState(null);
	var [simpleFlow, setSimpleFlow] = useState(null);

	function delData(id) {
		var arr = [...data];
		arr = arr.filter((obj) => {
			return obj.id !== id;
		})
		setData(prev => arr);
	}

	useEffect(() => {
		function generateConfigs() {
			let nodeArr = [];
			let linkArr = [];
			let dict = {};
			for (var i = 0; i < data.length; i++) {
				dict[data[i].payer] = 1;
				dict[data[i].payee] = 1;
				linkArr.push({ target: data[i].payee, source: data[i].payer, weight: data[i].amount });
			}
			for (let key in dict) {
				nodeArr.push({ id: key });
			}
			return { nodeArr: nodeArr, linkArr: linkArr };
		}

		function generateGraph() {
			if (data.length === 0) {
				setFlow(null);
				setSimpleFlow(null);
				return;
			}
			let { nodeArr, linkArr } = generateConfigs();
			var dataa = {
				nodes: nodeArr,
				links: linkArr
			};
			const myConfig = {
				freezeAllDragEvents: true,
				nodeHighlightBehavior: true,
				node: {
					color: "skyblue",
					highlightStrokeColor: "blue",
					fontSize: 10,
					fontColor: 'white',
					labelPosition: 'top',
				},
				link: {
					highlightColor: "lightblue",
					renderLabel: true,
					labelProperty: "weight",
					fontSize: 10,
					fontColor: 'white'
				},
				directed: true,
				height: 300,
				width: 600,
			};

			var g = <> <h4 className='text-center' style={{color: "white"}}>Flow</h4> <Graph
				id="graph-id-output" // id is mandatory
				data={dataa}
				config={myConfig}
			/> </>
			setFlow(g);

			var simplifiedData = splitwise(data);
			var g1 = <> <h4 className='text-center' style={{color: "white"}}>SimpleFlow</h4> <Graph
				id="graph-id-output" // id is mandatory
				data={simplifiedData}
				config={myConfig}
			/> </>
			setSimpleFlow(g1);
		}

		generateGraph()
	}, [data])

	function DataTile(props) {
		return (
			<tr>
				<td>{props.payer}</td>
				<td>{props.payee}</td>
				<td>{props.amount}</td>
				<td><button onClick={() => delData(props.id)} className="btn btn-outline-warning btn-sm"><i className="fas fa-trash"></i></button></td>
			</tr>
		)
	}

	function addData() {
		if (payer.trim() === '' || payee.trim() === '' || amount === '' || parseInt(amount) <= 0 || payer.trim().toLowerCase() === payee.trim().toLowerCase()) {
			alert("names cannot be same or empty (case insensitive) and amount cannot be 0 or negative")
			return;
		}
		setPayee(prev => prev.trim().toLowerCase());
		setPayer(prev => prev.trim().toLowerCase());	
		setData(prev => [...prev, { 'id': objId, 'payee': payee, 'payer': payer, 'amount': parseInt(amount) }]);
		setPayee('');
		setPayer('');
		setObjId(prev => prev + 1);
		setAmount('');
	}

	return (
		<div className="App bgdark">
			<div className="container-fluid">
				<h1 className='text-center mb-5 pt-3 text-light'><i className='fab fa-typo3' style={{padding: "5px"}} /> SimplyFlow | Simplfying Transactions</h1>
				<div className="row">
					<div className="col-md-6 p-2">
						<table className='table table-dark table-bordered border-light table-hover table-responsive'>
							<thead className='text-center border-none'>
								<tr>
									<th>Payer</th>
									<th>Payee</th>
									<th>Amount</th>
									<th>Action</th>
								</tr>
								<tr>
									<td><input type='text' className='custom_input' value={payer} onChange={(e) => setPayer(e.target.value)} placeholder='Enter Payer' /></td>
									<td><input type='text' className='custom_input' value={payee} onChange={(e) => setPayee(e.target.value)} placeholder='Enter Payee' /></td>
									<td><input type='number' className='custom_input' value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='Enter Amount' /></td>
									<td><button onClick={addData} className='btn fe-bold btn-outline-primary btn-sm'><i className="fas fa-plus-square"></i></button></td>
								</tr>
							</thead>
							<tbody className="text-center">
								{
									data.map((val, idx) => (
										<DataTile key={idx} payer={val.payer} payee={val.payee} amount={val.amount} id={val.id} />
									))
								}
							</tbody>
						</table>
					</div>
					<div className="col-md-6 p-2">
						{flow}
						<br />
						{simpleFlow}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;

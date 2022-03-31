import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Modal, message, Alert, AutoComplete, Popconfirm } from 'antd';
import { Fwrapper, SInput, Sp, STA, Stitle } from '../../../component_style';
import { Select } from 'antd';
import axios from 'axios';
import moment from 'moment';

export default function Purchase() {
    const { Option } = Select;

    const [queryData, setQueryData] = useState([]);
    const [vendorOptions, setVendorOptions] = useState([])
    const [selected, setSelected] = useState('')
    const [purNo, setPurNo] = useState('')
    const [vendor, setVendor] = useState('')
    const [editer, setEditer] = useState('')
    const [editime, setEditime] = useState('')
    const [remark, setRemark] = useState('')
    const [seq, setSeq] = useState('')

    const [btns, setBtns] = useState({
        add: true,
        del: false,
        save: false,
        edit: false
    })

    //------------------------------------------axios----------------------------------- 
    const renderData = () => {
        axios.get('/api/incomings.json')
            .then((res) => {
                setQueryData(res.data.result)
                console.log('render incomings...')
                // console.log(res.data.result);
            })
            .catch((error) => console.log(error.response))
        axios.get('/api/vendors.json')
            // await axios.get('/api/vendors.json')
            .then((res) => {
                setVendorOptions(res.data.result)
                console.log('render vendors...')
            })
            .catch((error) => console.log(error.response))
    }
    useEffect(() => {
        renderData();
        // console.log(moment().format('h:mm:ss.SSS'));
        // console.log(typeof (purNo));
    }, [])

    const backToInit = () => {
        setBtns({
            add: true,
            del: false,
            save: false,
            edit: false
        })
        setSeq('')
        setPurNo('')
        setVendor('')
        setEditer('')
        setRemark('')
        setEditime('')
        setSelected('')
    }
    //----------------------------------------------------------------------------- 
    const showDetail = (e) => {
        let arr = []
        for (var i = 0; i < queryData.length; i++) {
            if (e === queryData[i].Pur_no) {
                arr = queryData[i]
                // console.log('a');
            }
        }
        setSeq(arr.Seq)
        setPurNo(arr.Pur_no)
        setVendor(arr.Vendor)
        setEditer(arr.People)
        if (arr.People_time != null) setEditime(arr.People_time)
        else setEditime('')
        if (arr.Remark != null) setRemark(arr.Remark)
        else setRemark('')

        arr = []

        // console.log(typeof (e), e);
        if (e === undefined) {
            backToInit()
        } else if (e !== null) {
            setBtns({
                add: false,
                del: true,
                save: false,
                edit: true
            })
        } else {
            setBtns({
                add: true,
                del: false,
                save: true,
                edit: false
            })
        }
        setSelected(e)
    }
    //------------------------------------------Delete-----------------------------------
    const [isDelVisible, setIsDelVisible] = useState(false);

    const showDelCheck = () => {
        setIsDelVisible(true);
    };
    const OkDelete = () => {
        setIsDelVisible(false);
        axios.delete('/api/incoming/' + purNo)
            .then(() => {
                console.log('刪除成功')
                message.info('刪除成功');
                renderData()
                backToInit()
            })
            .catch((error) => console.log(error.response))
    };
    const CancelDelete = () => {
        setIsDelVisible(false);
    };
    //------------------------------------------Insert-----------------------------------

    const [canAdd, setCanAdd] = useState(true)

    const checkPurNo = (e) => {

        let result = e.replace(/[^\w./]/ig, '');
        setPurNo(result.trim())

        if (result.length > 0) {
            result = result.replace(/\s+/g, '')
            console.log('e :', '"', result, '"')
            for (var i = 0; i < queryData.length; i++) {
                if (result === queryData[i].Pur_no) {
                    // message.warning('單號已存在');
                    setIsPopVisible(true)
                    setCanAdd(false)
                    break
                } else {
                    setIsPopVisible(false)
                    setCanAdd(true)
                }
            }
        }
    }
    // console.log('purNo', '"', purNo, '"');
    // console.log(canAdd)
    const [isPopVisible, setIsPopVisible] = useState(false);
    const confirm = () => {
        showDetail(purNo)
        toEdit()
        setIsPopVisible(false)
    }
    const toAdd = () => {
        console.log('toAdd: ', canAdd)
        if (canAdd && (purNo !== null && purNo !== "" && purNo !== undefined)) {
            // console.log('1 : ', canAdd)
            if (canAdd && (vendor !== null && vendor !== "" && vendor !== undefined)) {
                // console.log('2 : ', canAdd)
                if (canAdd && (editer !== null && editer !== "" && editer !== undefined)) {
                    // console.log('3 : ', canAdd)
                    var result = {
                        "Pur_no": purNo,
                        "Vendor": vendor,
                        "People": editer,
                        "Remark": remark,
                        "People_time": moment(editime),
                    }
                    axios.post('/api/incoming', result)
                        .then((res) => {
                            message.info('新增成功');
                            console.log('新增成功');
                            // console.log('purNo', '"', p, '"');
                            renderData()
                            backToInit()
                        })
                        .catch((error) => {
                            console.log(error.response);
                            console.log(result)
                        })
                } else { message.error('開單人不可為空') }
            } else { message.error('廠商不可為空') }
        } else { message.error('單號不可為空') }
    }
    //------------------------------------------save-----------------------------------
    const toUpdate = () => {
        setBtns({
            add: false,
            del: true,
            save: false,
            edit: true
        })
        var result = {
            "Seq": seq,
            "Pur_no": purNo,
            "Vendor": vendor,
            "People": editer,
            "Remark": remark,
            "People_time": moment(editime),
        };

        axios.put('/api/incoming', result)
            .then(() => {
                message.info('更新成功');
                console.log('更新成功');
                console.log(result);
                renderData()
                backToInit()
            })
            .catch((error) => {
                console.log(error.response);
                console.log(result)
            })
    }
    //------------------------------------------Edit----------------------------------- 
    const toEdit = () => {
        setBtns({
            add: false,
            del: false,
            save: true,
            edit: false
        })
    }
    //------------------------------------------AutoComplete----------------------------------- 
    let vArray = [];
    vArray.push({ value: vendor });
    for (let i = 0; i < vendorOptions.length; i++) {
        if (vendorOptions[i] != null) vArray.push({ value: vendorOptions[i].Vendor_no });
    }

    let pArray = [];
    pArray.push({ value: purNo });
    for (let i = 0; i < queryData.length; i++) {
        if (queryData[i] != null) pArray.push({ value: queryData[i].Pur_no });
    }

    return (
        <>
            {/* ------------------------------------------form----------------------------------- */}
            <Fwrapper>
                <Row><Stitle>進貨</Stitle></Row>
                <Row>
                    <Col span={8}>
                        <Col style={{ marginTop: '1rem' }}>
                            <Sp style={{ textAlign: 'center' }}>採購單號查詢</Sp>
                            <Col style={{ display: 'flex', justifyContent: 'center' }}>
                                <Select
                                    value={selected}
                                    onChange={e => showDetail(e)}
                                    showSearch
                                    allowClear
                                    backfill='true'
                                    style={{ width: 250, margin: '0 auto' }}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    filterSort={(optionA, optionB) =>
                                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                    }
                                >
                                    {queryData.map((m) => (
                                        <Option
                                            key={m.Seq}
                                            value={m.Pur_no}
                                        >{m.Pur_no}</Option>
                                    ))}
                                </Select>
                            </Col>
                        </Col>
                    </Col>
                    <Col span={8}>
                        <Row>
                            <Col span={6}><Sp>採購單號</Sp></Col>
                            <Col span={12}>
                                {!btns.edit ?
                                    // <SInput
                                    //     value={purNo} onChange={e => checkPurNo(e.target.value)} required />
                                    <AutoComplete
                                        value={purNo}
                                        style={{
                                            width: '100%',
                                            margin: '0.2rem 0'
                                        }}
                                        options={pArray}
                                        backfill='true'
                                        onChange={e => checkPurNo(e)}
                                        filterOption={(inputValue, option) =>
                                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        } /> :
                                    <SInput value={purNo} readOnly />
                                }
                            </Col>
                            <Popconfirm
                                title="單號已存在，是否修改"
                                visible={isPopVisible}
                                onConfirm={confirm}
                                okText="Yes"
                                showCancel={false}
                                placement="rightTop"
                            />

                        </Row>
                        <Row>
                            <Col span={6}><Sp>廠商名稱</Sp></Col>
                            <Col span={12}>
                                {!btns.edit ?
                                    <AutoComplete
                                        value={vendor}
                                        style={{
                                            width: '100%',
                                            margin: '0.2rem 0'
                                        }}
                                        backfill='true'
                                        options={vArray}
                                        onChange={e => setVendor(e)}
                                        onSelect={e => setVendor(e)}
                                        filterOption={(inputValue, option) =>
                                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    /> :
                                    <SInput value={vendor} readOnly />
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}><Sp>開單人</Sp></Col>
                            <Col span={12}>
                                {!btns.edit ?
                                    <SInput value={editer} onChange={e => setEditer(e.target.value)} required /> :
                                    <SInput value={editer} readOnly />
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}><Sp>開單時間</Sp></Col>
                            <Col span={12}>
                                {!btns.edit ?
                                    <SInput type="dateTime-local" value={editime} onChange={e => {
                                        setEditime(e.target.value)
                                        // console.log(moment(e.target.value.substring(0, 10)))
                                    }} /> :
                                    <SInput value={editime.substring(0, 10)} readOnly />
                                }
                            </Col>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <Row>
                            <Col><Sp>備註</Sp></Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                {!btns.edit ?
                                    <STA value={remark} onChange={e => setRemark(e.target.value)} /> :
                                    <STA value={remark} readOnly />
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Fwrapper>
            {/* ------------------------------------------buttons----------------------------------- */}
            <div style={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "center",
            }}
            >
                <Button type="primary" disabled={!btns.add} onClick={toAdd} >新增</Button>
                <Button style={{ marginLeft: "1rem" }} disabled={!btns.del} onClick={showDelCheck}>刪除</Button>
                <Button style={{ marginLeft: "1rem" }} disabled={!btns.save} onClick={toUpdate}>儲存</Button>
                <Button style={{ marginLeft: "1rem" }} disabled={!btns.edit} onClick={toEdit} >修改</Button>

                <Modal title="刪除資料" visible={isDelVisible} onOk={OkDelete} onCancel={CancelDelete}>
                    <p>確定刪除這筆資料嗎?</p>
                    <p>單號: {purNo} </p>
                </Modal>

            </div>
        </>
    )
}

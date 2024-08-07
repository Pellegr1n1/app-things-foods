import React, { useEffect, useState } from "react";
import { Head, useForm } from '@inertiajs/react';
import { Table, Space, Modal, ColorPicker, Tag, Tooltip, message } from "antd";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProductForm from "./Components/Product/ProductForm";
import CustomCard from './Components/Cart/Card';
import styles from './Styles/Product.module.css';
import defaultImage from '@/Assets/Images/commonItem.jpg';
import { Inertia } from '@inertiajs/inertia';

export default function Product({ auth, products, categories, address, product }) {
    const {
        delete: destroy,
        get,
    } = useForm();

    const [listProducts, setListProducts] = useState([]);
    const [previewProduct, setPreviewProduct] = useState({
        nmproduct: '',
        qtproduct: '',
        price: '',
        color: '',
        image: defaultImage
    });

    useEffect(() => {
        if (address.length === 0) {
            message.warning('Por favor, cadastre um endereço para prosseguir com o cadastro de produto.').then(() => {
                Inertia.visit(route('address.edit'));
            });
        }
        setListProducts(products);
    }, [products]);

    const handleDelete = (record) => {
        Modal.confirm({
            title: "Confirmar exclusão",
            content: "Tem certeza que deseja excluir este produto?",
            okText: "Sim",
            cancelText: "Cancelar",
            onOk() {
                destroy(route('products.destroy', { id: record.id }), {
                    onSuccess: () => {
                        message.success('Produto excluído com sucesso!');
                    },
                    onError: (error) => {
                        message.error('Erro ao excluir o produto!');
                        console.error('Erro ao excluir o produto:', error);
                    }
                });
            }

        });
    };
    const handleEdit = (record) => {
        message.info('Você entrou em modo edição, para sair clique em cancelar!');
        get(route('products.edit', { id: record.id }))
    };

    const handlePreviewChange = (data) => {
        if (data.image instanceof File || data.image instanceof Blob) {
            setPreviewProduct({
                nmproduct: data.nmproduct,
                qtproduct: data.qtproduct,
                price: data.price,
                color: data.color,
                image: URL.createObjectURL(data.image)
            });
        } else {
            setPreviewProduct({
                nmproduct: data.nmproduct,
                qtproduct: data.qtproduct,
                price: data.price,
                color: data.color,
                image: defaultImage
            });
        }
    };

    const handleResetPreview = () => {
        setPreviewProduct({
            nmproduct: '',
            qtproduct: '',
            price: '',
            color: '',
            image: defaultImage
        });
    };

    const columns = [
        {
            title: "Categoria",
            width: '17%',
            align: 'center',
            dataIndex: "category[id]",
            key: "category[id]",
            render: (_, record) => (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <ColorPicker value={record.category.color} disabled />
                    <span style={{ marginLeft: '8px' }}>{record.category.nmcategory}</span>
                </span>
            ),
        },
        {
            title: "Nome",
            align: 'center',
            width: '25%',
            dataIndex: "nmproduct",
            key: "nmproduct",
        },
        {
            title: "Preço",
            align: 'center',
            width: '15%',
            dataIndex: "price",
            key: "price",
        },
        {
            title: "Estoque",
            align: 'center',
            width: '15%',
            dataIndex: "qtproduct",
            key: "qtproduct",
        },
        {
            title: "Situação",
            align: 'center',
            width: '10%',
            dataIndex: "fgenabled",
            key: "fgenabled",
            render: (fgenabled) => (
                fgenabled === "1" ? <Tag color="green">Habilitado</Tag> : <Tag color="red">Desabilitado</Tag>
            ),
        },
        {
            title: "Ações",
            align: 'center',
            key: "action",
            render: (record) => (
                <Space size={30}>
                    <Tooltip title='Editar'>
                        <a onClick={() => handleEdit(record)}>
                            <FaRegEdit className={styles.iconEdit} size={20} />
                        </a>
                    </Tooltip>
                    <Tooltip title='Excluir'>
                        <a onClick={() => handleDelete(record)}>
                            <IoTrashOutline className={styles.iconDelete} size={20} />
                        </a>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <>
                    <h2 className="font-semibold text-xl text-white leading-tight">Produto</h2>
                    <p className="text-sm text-white/80">Cadastre produtos para serem anunciados no carrinho</p>
                </>
            }
        >
            <Head title="Produto" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex">
                        <div className="w-1/2 pr-4 flex items-center justify-center">
                            <div>
                                <div className="flex items-center justify-center mb-4">
                                    <h1 className="font-semibold text-xl text-gray-800 leading-tight">Pré-visualização</h1>
                                </div>

                                <CustomCard
                                    categoryColor={previewProduct.color}
                                    key={1}
                                    id={1}
                                    name={previewProduct.nmproduct || "Nome do Produto"}
                                    price={previewProduct.price || "0,00"}
                                    stock={previewProduct.qtproduct || 12}
                                    src={previewProduct.image}
                                    company={'Empresa'}
                                    initialQuantity={0}
                                    onAddItem={() => { }}
                                    onRemoveItem={() => { }}
                                    showModal={() => { }}
                                />
                            </div>
                        </div>
                        <div className="w-1/2 pl-4">
                            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                                <ProductForm
                                    editProduct={product}
                                    disabled={address.length === 0}
                                    auth={auth.user.id}
                                    categories={categories}
                                    onPreviewChange={handlePreviewChange}
                                    onResetPreview={handleResetPreview}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-10">
                        <Table columns={columns} dataSource={listProducts} pagination={{ pageSize: 5 }} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

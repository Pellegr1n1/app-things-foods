import { useEffect, useState } from 'react';
import { Form, Input, Button, InputNumber, Select, Upload, ConfigProvider, message } from 'antd';
import { useForm } from '@inertiajs/react';
import { PlusOutlined } from '@ant-design/icons';

export default function ProductForm({ editProduct, categories, onPreviewChange, onResetPreview, disabled }) {

    const { data, setData, errors, processing, post, put } = useForm({
        nmproduct: editProduct ? editProduct.nmproduct : '',
        qtproduct: editProduct ? editProduct.qtproduct : '',
        price: editProduct ? editProduct.price : '',
        color: editProduct && editProduct.category ? editProduct.category.color : '',
        fgenabled: editProduct ? editProduct.fgenabled : 1,
        idcategory: editProduct ? editProduct.idcategory : '',
        image: editProduct ? editProduct.image : null
    });

    const [listCategory, setListCategory] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setListCategory(categories);
        if (editProduct) {
            setIsEditing(true);
        }
    }, [categories]);

    useEffect(() => {
        onPreviewChange(data);
    }, [data]);

    const submit = () => {
        if (isEditing) {
            put(route('products.update', { id: editProduct.id }), {
                onSuccess: () => {
                    resetForm();
                    message.success('Produto atualizado com sucesso!');
                },
                onError: (error) => {
                    message.error('Erro ao atualizar o produto!');
                    console.error('Erro ao atualizar o produto:' + error);
                }
            });
        } else {
            post(route('products.store'), {
                onSuccess: () => {
                    resetForm();
                    message.success('Produto cadastrado com sucesso!');
                },
                onError: (error) => {
                    message.error('Erro ao cadastrar o produto!');
                    console.error('Erro ao cadastrar o produto:' + error);
                }
            });
        }
    };

    const options = listCategory.map(item => ({
        value: `${item.id}-${item.color}`,
        label: item.nmcategory,
    }));

    const resetForm = () => {
        setData({
            nmproduct: '',
            qtproduct: '',
            price: '',
            color: '',
            fgenabled: 1,
            idcategory: '',
            image: null
        })
        setIsEditing(false);
    };

    const handleCategoryChange = (value) => {
        const [id, color] = value.split('-');
        setData({
            ...data,
            idcategory: id,
            color: color
        });
    };

    return (
        <Form onFinish={submit} layout="vertical" className="mt-6 space-y-6" encType='multipart/form-data'>
            <Form.Item
                label="Nome"
                validateStatus={errors.nmproduct ? 'error' : ''}
                help={errors.nmproduct}
            >
                <Input
                    value={data.nmproduct}
                    onChange={(e) => setData('nmproduct', e.target.value)}
                    required
                    autoComplete="nmproduct"
                    style={{ borderRadius: '6px', borderColor: "#d9d9d9" }}
                    disabled={disabled}
                />
            </Form.Item>

            <Form.Item
                label="Quantidade"
                validateStatus={errors.qtproduct ? 'error' : ''}
                help={errors.qtproduct}
            >
                <InputNumber
                    value={data.qtproduct}
                    onChange={(value) => setData('qtproduct', value)}
                    required
                    autoComplete="qtproduct"
                    size="large"
                    style={{ width: '100%', borderRadius: '6px' }}
                    disabled={disabled}
                    min={0}
                />
            </Form.Item>

            <Form.Item
                label="Categoria"
                validateStatus={errors.idcategory ? 'error' : ''}
                help={errors.idcategory}
            >
                <Select
                    options={options}
                    value={data.idcategory ? `${data.idcategory}-${data.color}` : undefined}
                    onChange={handleCategoryChange}
                    size="large"
                    style={{ width: '100%' }}
                    disabled={disabled}
                />
            </Form.Item>

            <div className="flex justify-between space-x-4">
                <Form.Item
                    label="Preço"
                    validateStatus={errors.price ? 'error' : ''}
                    help={errors.price}
                    className="w-1/2"
                >
                    <Input
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                        required
                        autoComplete="price"
                        style={{ borderRadius: '6px', borderColor: "#d9d9d9" }}
                        disabled={disabled}
                    />
                </Form.Item>
                <Form.Item
                    label="Situação"
                    validateStatus={errors.fgenabled ? 'error' : ''}
                    help={errors.fgenabled}
                    className="w-1/2"
                >
                    <Select
                        options={[
                            {
                                value: 1,
                                label: 'Habilitado',
                            },
                            {
                                value: 2,
                                label: 'Desabilitado'
                            }
                        ]}
                        value={data.fgenabled == 1 ? 'Habilitado' : 'Desabilitado'}
                        onChange={(value) => setData('fgenabled', value)}
                        size='large'
                        style={{ borderRadius: '6px', borderColor: "#d9d9d9" }}
                        disabled={disabled}
                    />

                </Form.Item>
            </div>

            <div className='flex justify-between w-full'>
                <Form.Item
                    label="Imagem"
                    validateStatus={errors.image ? 'error' : ''}
                    help={errors.image}
                >
                    <Upload
                        name="image"
                        listType="picture-card"
                        maxCount={1}
                        onChange={(e) => setData('image', e.file)}
                        beforeUpload={() => false}
                        disabled={isEditing || disabled}
                    >
                        {'+ Upload'}
                    </Upload>
                </Form.Item>
                <Form.Item className='flex items-end'>
                    <Button type="primary" htmlType="submit" loading={processing} disabled={disabled} className="h-[40px] w-[100px]">
                        {isEditing ? "Salvar" : "Cadastrar"}
                    </Button>
                    <Button type="primary" onClick={resetForm} disabled={disabled} className="h-[40px] w-[100px] ml-2">
                        Cancelar
                    </Button>
                </Form.Item>
            </div>
        </Form>
    );
}

import { useRef } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

const { Title, Paragraph } = Typography;

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = () => {
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-900">Informações de Perfil</h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Atualize as informações de perfil e endereço de e-mail da sua contas.
                </p>
            </header>

            <Form onFinish={updatePassword} layout="vertical" className="mt-6 space-y-6">
                <Form.Item
                    label="Senha Atual"
                    validateStatus={errors.current_password ? 'error' : ''}
                    help={errors.current_password}
                >
                    <Input.Password
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                        style={{ borderRadius: '6px', backgroundColor: "#f3f4f6", borderColor: "#d9d9d9" }}
                    />
                </Form.Item>

                <Form.Item
                    label="Nova Senha"
                    validateStatus={errors.password ? 'error' : ''}
                    help={errors.password}
                >
                    <Input.Password
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        style={{ borderRadius: '6px', backgroundColor: "#f3f4f6", borderColor: "#d9d9d9" }}
                    />
                </Form.Item>

                <Form.Item
                    label="Confirmar Senha"
                    validateStatus={errors.password_confirmation ? 'error' : ''}
                    help={errors.password_confirmation}
                >
                    <Input.Password
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        style={{ borderRadius: '6px', backgroundColor: "#f3f4f6", borderColor: "#d9d9d9" }}
                    />
                </Form.Item>

                <div className="flex items-center gap-4">
                    <Button type="primary" htmlType="submit" loading={processing} style={{ backgroundColor: "#01344a" }}>
                        Salvar
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <Paragraph type="success" className="ml-2">
                            Salvando.
                        </Paragraph>
                    </Transition>
                </div>
            </Form>
        </section>
    );
}

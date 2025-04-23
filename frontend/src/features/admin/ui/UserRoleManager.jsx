import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../model';
import Button from '../../../shared/ui/Button';
import Modal from '../../../shared/ui/Modal';

const UserRoleManager = () => {
  const {
    users,
    isLoadingUsers,
    userError,
    isSubmitting,
    submitError,
    fetchUsers,
    changeUserRole
  } = useAdminStore();

  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [roleValue, setRoleValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Фильтрация пользователей
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Обработчики действий
  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setRoleValue(user.role);
    setIsEditModalOpen(true);
  };

  const handleRoleChange = (e) => {
    setRoleValue(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    const result = await changeUserRole(selectedUser.id, roleValue);
    if (result) {
      setIsEditModalOpen(false);
    }
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return 'Н/Д';

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  if (isLoadingUsers) {
    return (
      <div className="p-6 text-center">
        <p>Загрузка пользователей...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управление пользователями</h2>
        <Button onClick={() => fetchUsers()}>Обновить</Button>
      </div>

      {userError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {userError}
        </div>
      )}

      {/* Поиск */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск по имени или email..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-3 pr-10 border rounded-lg"
          />
          <div className="absolute right-3 top-3 text-gray-400">
            🔍
          </div>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">Нет данных о пользователях</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Имя пользователя</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Дата регистрации</th>
                <th className="py-3 px-4 text-left">Роль</th>
                <th className="py-3 px-4 text-left">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{user.id.slice(0, 8)}...</td>
                  <td className="py-3 px-4">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName} (${user.username})`
                      : user.username}
                  </td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{formatDate(user.createdAt)}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                      }`}>
                      {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="secondary"
                      onClick={() => handleOpenEditModal(user)}
                      className="text-sm py-1 px-2"
                    >
                      Изменить роль
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Модальное окно изменения роли */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Изменение роли пользователя"
        size="small"
      >
        <form onSubmit={handleUpdateRole}>
          <div className="mb-4">
            <p className="mb-2">
              <span className="font-medium">Пользователь:</span> {selectedUser?.username}
            </p>
            <p className="mb-4">
              <span className="font-medium">Email:</span> {selectedUser?.email}
            </p>

            <label className="block text-sm font-medium mb-1">Роль</label>
            <select
              value={roleValue}
              onChange={handleRoleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
            </select>
          </div>

          {submitError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              {submitError}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || roleValue === selectedUser?.role}
            >
              {isSubmitting ? 'Сохранение...' : 'Обновить роль'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserRoleManager;

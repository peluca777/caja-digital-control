
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Transaction } from '@/lib/types';
import { X, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditTransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTransaction: Transaction) => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Transaction | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (transaction) {
      setFormData({ ...transaction });
    }
  }, [transaction]);

  const handleSave = () => {
    if (!formData) return;

    // Validaciones
    if (!formData.concept.trim()) {
      toast({
        title: "Error de validación",
        description: "El concepto no puede estar vacío",
        variant: "destructive",
      });
      return;
    }

    if (formData.amount <= 0) {
      toast({
        title: "Error de validación",
        description: "El monto debe ser mayor a cero",
        variant: "destructive",
      });
      return;
    }

    if (!formData.paymentMethod) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar un método de pago",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
    onClose();
    
    toast({
      title: "✅ Transacción actualizada",
      description: "Los cambios se guardaron correctamente",
    });
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Editar Transacción
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400 mt-1">
                Modifica los datos de la transacción
              </DialogDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Tipo de Movimiento
            </Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: 'income' | 'expense') => 
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
                <SelectItem value="income" className="text-gray-900 dark:text-gray-100">
                  Ingreso
                </SelectItem>
                <SelectItem value="expense" className="text-gray-900 dark:text-gray-100">
                  Egreso
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Concepto
            </Label>
            <Input
              value={formData.concept}
              onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl"
              placeholder="Descripción del movimiento"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Monto
            </Label>
            <Input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Método de Pago
            </Label>
            <Select 
              value={formData.paymentMethod} 
              onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
            >
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
                <SelectItem value="Efectivo" className="text-gray-900 dark:text-gray-100">
                  Efectivo
                </SelectItem>
                <SelectItem value="Transferencia" className="text-gray-900 dark:text-gray-100">
                  Transferencia
                </SelectItem>
                <SelectItem value="Tarjeta" className="text-gray-900 dark:text-gray-100">
                  Tarjeta
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Observaciones
            </Label>
            <Textarea
              value={formData.observations || ''}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl resize-none"
              rows={3}
              placeholder="Comentarios adicionales..."
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionModal;

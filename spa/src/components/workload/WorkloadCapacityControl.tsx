import { useState } from 'react';
import { useWorkloadStore } from '../../stores/WorkloadStore';
import { i18n } from '../../utils/i18n';

interface WorkloadCapacityControlProps {
    assignees: ReadonlyArray<{ id: number | null; name: string }>;
    disabled: boolean;
}

export function WorkloadCapacityControl({ assignees, disabled }: WorkloadCapacityControlProps) {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const { workloadCapacityByAssignee, setAssigneeCapacity, capacityThreshold } = useWorkloadStore();
    const assignee = assignees.find(item => item.id === selectedId && item.id !== null);
    const label = i18n.t('label_workload_person_capacity') || 'Capacity by assignee (hours/day)';

    return (
        <div style={{ display: 'grid', gap: 4 }}>
            <label style={{ display: 'grid', gap: 4 }}>
                {label}
                <select disabled={disabled} value={assignee?.id ?? ''}
                    onChange={event => setSelectedId(event.target.value === '' ? null : Number(event.target.value))}>
                    <option value="">{i18n.t('label_workload_select_assignee') || 'Select an assignee'}</option>
                    {assignees.map(item => item.id !== null && <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
            </label>
            {assignee && assignee.id !== null && (
                <input type="number" min={0} max={24} step="any" disabled={disabled}
                    aria-label={`${label} — ${assignee.name}`} placeholder={String(capacityThreshold)}
                    value={workloadCapacityByAssignee[assignee.id] ?? ''}
                    onChange={event => setAssigneeCapacity(assignee.id!, event.target.value === '' ? null : event.target.valueAsNumber)} />
            )}
        </div>
    );
}

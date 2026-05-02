import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, Alert, Modal, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, toggleTask, deleteTask, setTaskFilter, clearTasks } from '../../redux/slices/taskSlice';
import { useTheme } from '../../hooks/useTheme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import { spacing, fontSize, fontWeight, borderRadius } from '../../theme';

const ProjectDetailScreen = ({ route, navigation }) => {
  const { projectId, projectTitle } = route.params;
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { items: tasks, loading, filter } = useSelector((s) => s.tasks);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks({ projectId }));
    return () => { dispatch(clearTasks()); };
  }, [projectId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchTasks({ projectId }));
    setRefreshing(false);
  }, [projectId]);

  const openCreate = () => { setEditingTask(null); setTitle(''); setDueDate(''); setModalVisible(true); };
  const openEdit = (t) => { setEditingTask(t); setTitle(t.title); setDueDate(t.dueDate||''); setModalVisible(true); };

  const handleSave = async () => {
    if (!title.trim()) { Alert.alert('Error','Title required'); return; }
    const data = { title: title.trim() };
    if (dueDate.trim()) data.dueDate = dueDate.trim();
    if (editingTask) await dispatch(updateTask({ id: editingTask.id, data }));
    else await dispatch(createTask({ projectId, data }));
    setModalVisible(false);
  };

  const handleToggle = (task) => dispatch(toggleTask(task.id));

  const handleDelete = (t) => {
    Alert.alert('Delete Task', `Delete "${t.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteTask(t.id)) },
    ]);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const filters = ['all','pending','completed'];
  const completed = tasks.filter(t=>t.status==='completed').length;
  const total = tasks.length;

  const renderTask = ({ item }) => {
    const isComplete = item.status === 'completed';
    const isOverdue = item.dueDate && new Date(item.dueDate) < new Date() && !isComplete;
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={()=>handleToggle(item)} onLongPress={()=>handleDelete(item)} style={[styles.taskCard,{backgroundColor:colors.card,borderColor:isOverdue?colors.error:isComplete?colors.success:colors.border}]}>
        <TouchableOpacity onPress={()=>handleToggle(item)} style={[styles.checkbox,{borderColor:isComplete?colors.success:colors.border,backgroundColor:isComplete?colors.success:'transparent'}]}>
          {isComplete && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <View style={styles.taskBody}>
          <Text style={[styles.taskTitle,{color:colors.text,textDecorationLine:isComplete?'line-through':'none',opacity:isComplete?0.6:1}]} numberOfLines={2}>{item.title}</Text>
          <View style={styles.taskMeta}>
            <View style={[styles.statusBadge,{backgroundColor:isComplete?colors.successSurface:colors.warningSurface}]}>
              <Text style={[styles.statusText,{color:isComplete?colors.success:colors.warning}]}>{isComplete?'Done':'Pending'}</Text>
            </View>
            {item.dueDate && <Text style={[styles.dueText,{color:isOverdue?colors.error:colors.textTertiary}]}>📅 {new Date(item.dueDate).toLocaleDateString()}</Text>}
          </View>
        </View>
        <TouchableOpacity onPress={()=>openEdit(item)} hitSlop={{top:10,bottom:10,left:10,right:10}}><Text style={{fontSize:14}}>✏️</Text></TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container,{backgroundColor:colors.background}]}>
      {/* Header */}
      <LinearGradient colors={[colors.gradientStart,colors.gradientEnd]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.backBtn}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>{projectTitle}</Text>
            <Text style={styles.headerSub}>{completed}/{total} tasks completed</Text>
          </View>
          <View style={{width:40}}/>
        </View>
        {/* Progress */}
        <View style={styles.headerProg}>
          <View style={styles.progBg}><View style={[styles.progFill,{width:`${total>0?(completed/total)*100:0}%`}]}/></View>
        </View>
      </LinearGradient>

      {/* Filter pills */}
      <View style={styles.filterRow}>
        {filters.map(f=>(
          <TouchableOpacity key={f} onPress={()=>dispatch(setTaskFilter(f))} style={[styles.pill,{backgroundColor:filter===f?colors.primary:colors.surface,borderColor:filter===f?colors.primary:colors.border}]}>
            <Text style={[styles.pillText,{color:filter===f?'#FFF':colors.textSecondary}]}>{f.charAt(0).toUpperCase()+f.slice(1)}{f==='all'?` (${total})`:f==='pending'?` (${total-completed})`:` (${completed})`}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      <FlatList data={filteredTasks} renderItem={renderTask} keyExtractor={i=>i.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFF" colors={[colors.primary]}/>} ListEmptyComponent={!loading?<EmptyState icon={<Text style={{fontSize:48}}>✅</Text>} title={filter!=='all'?`No ${filter} tasks`:"No Tasks Yet"} subtitle="Tap + to add your first task" actionLabel="+ Add Task" onAction={openCreate}/>:null}/>

      {/* FAB */}
      <TouchableOpacity activeOpacity={0.85} onPress={openCreate}><LinearGradient colors={[colors.gradientStart,colors.gradientEnd]} style={styles.fab}><Text style={styles.fabT}>+</Text></LinearGradient></TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={()=>setModalVisible(false)}>
        <View style={[styles.overlay,{backgroundColor:colors.overlay}]}>
          <View style={[styles.modal,{backgroundColor:colors.surface}]}>
            <Text style={[styles.modalT,{color:colors.text}]}>{editingTask?'Edit Task':'New Task'}</Text>
            <Input label="Title *" placeholder="Task title" value={title} onChangeText={setTitle}/>
            <Input label="Due Date (YYYY-MM-DD)" placeholder="2025-12-31" value={dueDate} onChangeText={setDueDate}/>
            <View style={styles.modalActs}>
              <Button title="Cancel" variant="ghost" onPress={()=>setModalVisible(false)} style={{flex:1}}/>
              <Button title={editingTask?'Update':'Create'} onPress={handleSave} loading={loading} style={{flex:1}}/>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{flex:1},
  header:{paddingTop:spacing['4xl']+8,paddingBottom:spacing.lg,paddingHorizontal:spacing.xl},
  headerRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  backBtn:{width:40,height:40,borderRadius:20,backgroundColor:'rgba(255,255,255,0.2)',justifyContent:'center',alignItems:'center'},
  backIcon:{color:'#FFF',fontSize:22,fontWeight:fontWeight.bold},
  headerCenter:{flex:1,alignItems:'center'},
  headerTitle:{color:'#FFF',fontSize:fontSize.xl,fontWeight:fontWeight.bold},
  headerSub:{color:'rgba(255,255,255,0.8)',fontSize:fontSize.sm,marginTop:2},
  headerProg:{marginTop:spacing.md},
  progBg:{height:6,borderRadius:3,backgroundColor:'rgba(255,255,255,0.25)'},
  progFill:{height:'100%',borderRadius:3,backgroundColor:'#FFF'},
  filterRow:{flexDirection:'row',paddingHorizontal:spacing.xl,paddingVertical:spacing.md,gap:spacing.sm},
  pill:{paddingVertical:spacing.sm,paddingHorizontal:spacing.base,borderRadius:borderRadius.full,borderWidth:1},
  pillText:{fontSize:fontSize.sm,fontWeight:fontWeight.medium},
  list:{paddingHorizontal:spacing.xl,paddingBottom:100},
  taskCard:{flexDirection:'row',alignItems:'center',padding:spacing.base,borderRadius:borderRadius.lg,borderWidth:1,marginBottom:spacing.sm},
  checkbox:{width:28,height:28,borderRadius:14,borderWidth:2,justifyContent:'center',alignItems:'center',marginRight:spacing.md},
  checkmark:{color:'#FFF',fontSize:14,fontWeight:fontWeight.bold},
  taskBody:{flex:1,marginRight:spacing.sm},
  taskTitle:{fontSize:fontSize.base,fontWeight:fontWeight.medium,marginBottom:spacing.xs},
  taskMeta:{flexDirection:'row',alignItems:'center',gap:spacing.sm},
  statusBadge:{paddingVertical:2,paddingHorizontal:spacing.sm,borderRadius:borderRadius.sm},
  statusText:{fontSize:fontSize.xs,fontWeight:fontWeight.semibold},
  dueText:{fontSize:fontSize.xs},
  fab:{position:'absolute',bottom:24,right:24,width:60,height:60,borderRadius:30,justifyContent:'center',alignItems:'center',elevation:8},
  fabT:{color:'#FFF',fontSize:28,fontWeight:fontWeight.bold,marginTop:-2},
  overlay:{flex:1,justifyContent:'flex-end'},
  modal:{borderTopLeftRadius:borderRadius['2xl'],borderTopRightRadius:borderRadius['2xl'],padding:spacing.xl,paddingBottom:spacing['3xl']},
  modalT:{fontSize:fontSize.xl,fontWeight:fontWeight.bold,marginBottom:spacing.xl},
  modalActs:{flexDirection:'row',gap:spacing.md,marginTop:spacing.md},
});

export default ProjectDetailScreen;
